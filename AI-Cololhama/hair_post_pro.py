import os
import cv2
import numpy as np
import torch
from PIL import Image
import torch.nn.functional as F
import torchvision.transforms as transforms
from scipy import ndimage

# tenta importar unet e bisenet depende do seu computador
try:
    from model import BiSeNet

    MODEL_TYPE = "bisenet"
except ImportError:
    BiSeNet = None

try:
    from unet import unet

    MODEL_TYPE = "unet"
except ImportError:
    unet = None

def pos_processamento(mask, min_area=500, kernel_size=3):
    # converter para escala cinza
    if len(mask.shape) == 3:
        mask_gray = cv2.cvtColor(mask.astype(np.uint8), cv2.COLOR_BGR2GRAY)
    else:
        mask_gray = mask.astype(np.uint8)

    # binariza a máscara
    _, binary_mask = cv2.threshold(mask_gray, 127, 255, cv2.THRESH_BINARY)

    # Remover pixels mortos
    kernel_opening = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
    cleaned_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_OPEN, kernel_opening)

    # remove ruidos muito pequenos
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(cleaned_mask, connectivity=8)

    # cria máscara sem os ruidos
    clean_mask = np.zeros_like(cleaned_mask)
    for i in range(1, num_labels):  # Pular o background (label 0)
        area = stats[i, cv2.CC_STAT_AREA]
        if area >= min_area:
            clean_mask[labels == i] = 255

    # preenche buracos dentro das regiões de cabelo
    kernel_closing = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size * 2, kernel_size * 2))
    filled_mask = cv2.morphologyEx(clean_mask, cv2.MORPH_CLOSE, kernel_closing)

    # preenche buracos com flood fill
    # Encontrar contornos para identificar regiões fechadas
    contours, _ = cv2.findContours(filled_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # cria máscara preenchida
    final_mask = filled_mask.copy()
    for contour in contours:
        # preenche os contorno
        cv2.fillPoly(final_mask, [contour], 255)

    # suaviza as bordas e bota filtro gaussiano
    final_mask = cv2.GaussianBlur(final_mask, (3, 3), 0)
    _, final_mask = cv2.threshold(final_mask, 127, 255, cv2.THRESH_BINARY)

    # volta pra rgb se precisar (isso vai dar um trampo dps scrr)
    if len(mask.shape) == 3:
        final_mask_rgb = np.zeros_like(mask)
        final_mask_rgb[final_mask == 255] = [255, 255, 255]
        return final_mask_rgb

    return final_mask


def vis_parsing_maps(im, parsing_anno, stride):
    # pega só o cabelo dos parsings do modelo, classe 13
    hair_mask = np.zeros((parsing_anno.shape[0], parsing_anno.shape[1], 3))
    hair_mask[parsing_anno == 13] = [255, 255, 255]  # Branco para cabelo
    return hair_mask


def load_model(model_path):
    #isso aqui é pra resolver o role da minha placa de video inexistente
    #pq eu n tava sabendo lidar com BiSeNet, ai usei o U-Net mas ambos estão disponíveis
    print("Analisando modelo salvo...")


    ## GPT salvando minha vida abaixo:
    # Carregar o checkpoint para inspecionar sua estrutura
    checkpoint = torch.load(model_path, map_location='cpu')

    # Verificar as chaves para determinar o tipo de modelo
    keys = list(checkpoint.keys())
    print(f"Encontrados {len(keys)} grupos de parâmetros no modelo")

    # Verificar chaves do BiSeNet
    bisenet_keys = any('cp.resnet' in key for key in keys)
    # Verificar chaves do U-Net
    unet_keys = any('conv1.conv1' in key or 'up_concat' in key for key in keys)

    print(f"Estrutura BiSeNet detectada: {bisenet_keys}")
    print(f"Estrutura U-Net detectada: {unet_keys}")

    if unet_keys and unet is not None:
        print("Carregando como modelo U-Net...")
        net = unet()
        net.load_state_dict(checkpoint)
        return net, "unet"
    elif bisenet_keys and BiSeNet is not None:
        print("Carregando como modelo BiSeNet...")
        net = BiSeNet(n_classes=19)
        net.load_state_dict(checkpoint)
        return net, "bisenet"
    else:
        # Se não conseguir determinar, tentar ambos
        if BiSeNet is not None:
            try:
                print("Tentando carregar como BiSeNet...")
                net = BiSeNet(n_classes=19)
                net.load_state_dict(checkpoint)
                return net, "bisenet"
            except RuntimeError as e:
                print(f"BiSeNet falhou: {e}")

        if unet is not None:
            try:
                print("Tentando carregar como U-Net...")
                net = unet()
                net.load_state_dict(checkpoint)
                return net, "unet"
            except RuntimeError as e:
                print(f"U-Net falhou: {e}")

        raise RuntimeError("Não foi possível carregar o modelo com nenhuma arquitetura")


def main():
    model_path = "models/parsenet/model.pth"
    if not os.path.exists(model_path):
        print(f"Modelo não encontrado em {model_path}")
        print("Por favor, verifique o caminho e certifique-se de que o arquivo do modelo existe.")
        return

    input_folder = "giuimages"
    output_folder = "hair_results"

    if not os.path.exists(input_folder):
        print(f"Pasta de entrada '{input_folder}' não encontrada!")
        return

    os.makedirs(output_folder, exist_ok=True)

    print("Carregando modelo...")
    try:
        net, model_type = load_model(model_path)
        print(f"Modelo {model_type} carregado com sucesso")
    except Exception as e:
        print(f"Falha ao carregar modelo: {e}")
        return

    # forçar uso da CPU
    print("Usando CPU")
    net.eval()

    # processar imagens
    to_tensor = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
    ])

    # obter arquivos de imagem
    image_files = [f for f in os.listdir(input_folder)
                   if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff'))]

    if not image_files:
        print(f"Nenhum arquivo de imagem encontrado em {input_folder}")
        return

    print(f"Processando {len(image_files)} imagens...")

    with torch.no_grad():
        for img_name in image_files:
            try:
                print(f"Processando: {img_name}")

                # carregar imagem
                img_path = os.path.join(input_folder, img_name)
                img = Image.open(img_path).convert('RGB')

                # redimensionar para 512x512 (tamanho comum para parsing facial)
                image = img.resize((512, 512), Image.BILINEAR)
                img_tensor = to_tensor(image)
                img_tensor = torch.unsqueeze(img_tensor, 0)

                # obter resultado do parsing
                if model_type == "bisenet":
                    # BiSeNet retorna múltiplas saídas
                    out = net(img_tensor)[0]  # Pegar a saída principal
                else:
                    # U-Net retorna saída única
                    out = net(img_tensor)

                #converter para mapa de parsing
                parsing = out.squeeze(0).cpu().numpy().argmax(0)

                # criar máscara de cabelo
                hair_mask = vis_parsing_maps(image, parsing, stride=1)

                # aplica pós-processamento 
                print("  → Aplicando pós-processamento...")
                clean_hair_mask = pos_processamento(hair_mask, min_area=300, kernel_size=3)

                # salvar resultado
                name_base = os.path.splitext(img_name)[0]

                # máscara original
                output_path_raw = os.path.join(output_folder, f"{name_base}_hair_raw.png")
                cv2.imwrite(output_path_raw, hair_mask)

                # máscara limpa
                output_path_clean = os.path.join(output_folder, f"{name_base}_hair_clean.png")
                cv2.imwrite(output_path_clean, clean_hair_mask)

                print(f"  → Salvo (bruto): {output_path_raw}")
                print(f"  → Salvo (limpo): {output_path_clean}")

                debug_path = os.path.join(output_folder, f"{name_base}_parsing.png")
                cv2.imwrite(debug_path, parsing.astype(np.uint8) * 13)
            except Exception as e:
                print(f"  Erro ao processar {img_name}: {e}")
                continue

    print("Concluído!")

if __name__ == '__main__':
    main()