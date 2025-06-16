import os
import cv2
import numpy as np
import torch
from PIL import Image
import torch.nn.functional as F
import torchvision.transforms as transforms
from scipy import ndimage
import colorsys

# Importar modelos (mesmo sistema do seu código original)
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


class ProcessCor:
    @staticmethod
    def cores_analogas(hex_color):
        r = int(hex_color[1:3], 16)
        g = int(hex_color[3:5], 16)
        b = int(hex_color[5:7], 16)

        r, g, b = r / 255.0, g / 255.0, b / 255.0

        h, l, s = colorsys.rgb_to_hls(r, g, b)

        s = min(max(s * 2.5, 0), 1)

        cores_analogas = []
        for angle in (-45, 45):
            h_new = (h + angle / 360.0) % 1.0
            r, g, b = colorsys.hls_to_rgb(h_new, l, s)
            r, g, b = int(r * 255), int(g * 255), int(b * 255)
            cores_analogas.append('#{:02x}{:02x}{:02x}'.format(r, g, b))

        return cores_analogas

    @staticmethod
    def cores_complementares(hex_color):
        r = int(hex_color[1:3], 16)
        g = int(hex_color[3:5], 16)
        b = int(hex_color[5:7], 16)

        r, g, b = r / 255.0, g / 255.0, b / 255.0

        h, l, s = colorsys.rgb_to_hls(r, g, b)

        h_comp = (h + 0.5) % 1.0
        r_comp, g_comp, b_comp = colorsys.hls_to_rgb(h_comp, l, s)
        r_comp, g_comp, b_comp = int(r_comp * 255), int(g_comp * 255), int(b_comp * 255)

        return '#{:02x}{:02x}{:02x}'.format(r_comp, g_comp, b_comp)


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
    contours, _ = cv2.findContours(filled_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # cria máscara preenchida
    final_mask = filled_mask.copy()
    for contour in contours:
        cv2.fillPoly(final_mask, [contour], 255)

    # suaviza as bordas e bota filtro gaussiano
    final_mask = cv2.GaussianBlur(final_mask, (3, 3), 0)
    _, final_mask = cv2.threshold(final_mask, 127, 255, cv2.THRESH_BINARY)

    return final_mask


def vis_parsing_maps(im, parsing_anno, stride):
    # pega só o cabelo dos parsings do modelo, classe 13
    hair_mask = np.zeros((parsing_anno.shape[0], parsing_anno.shape[1]))
    hair_mask[parsing_anno == 13] = 255  # Branco para cabelo
    return hair_mask


def load_model(model_path):
    print("Analisando modelo salvo...")

    checkpoint = torch.load(model_path, map_location='cpu')
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


def extrair_cor_media_cabelo(imagem_original, mascara_cabelo):
    """Extrai a cor média do cabelo usando a máscara"""
    # Converter imagem para RGB se necessário
    if len(imagem_original.shape) == 3 and imagem_original.shape[2] == 3:
        img_rgb = cv2.cvtColor(imagem_original, cv2.COLOR_BGR2RGB)
    else:
        img_rgb = imagem_original

    # Garantir que a máscara seja binária
    if len(mascara_cabelo.shape) == 3:
        mascara_cabelo = cv2.cvtColor(mascara_cabelo, cv2.COLOR_BGR2GRAY)

    # Pixels do cabelo
    pixels_cabelo = img_rgb[mascara_cabelo == 255]

    if len(pixels_cabelo) == 0:
        print("  ⚠️ Nenhum pixel de cabelo encontrado!")
        return "#000000"  # Retorna preto se não encontrar cabelo

    # Calcular cor média
    cor_media_rgb = np.mean(pixels_cabelo, axis=0)
    r, g, b = int(cor_media_rgb[0]), int(cor_media_rgb[1]), int(cor_media_rgb[2])

    # Converter para hex
    hex_color = '#{:02x}{:02x}{:02x}'.format(r, g, b)
    return hex_color


def aplicar_cor_cabelo(imagem_original, mascara_cabelo, nova_cor_hex):
    """Aplica uma nova cor ao cabelo usando a máscara"""
    # Converter nova cor hex para RGB
    nova_cor_rgb = [
        int(nova_cor_hex[1:3], 16),
        int(nova_cor_hex[3:5], 16),
        int(nova_cor_hex[5:7], 16)
    ]

    # Copiar imagem original
    imagem_resultado = imagem_original.copy()

    # Garantir que a máscara seja binária
    if len(mascara_cabelo.shape) == 3:
        mascara_cabelo = cv2.cvtColor(mascara_cabelo, cv2.COLOR_BGR2GRAY)

    # Aplicar cor onde a máscara indica cabelo
    # Usar blending para resultado mais natural
    alpha = 0.7  # Intensidade da nova cor (0.0 = original, 1.0 = nova cor completa)

    for i in range(3):  # Para cada canal RGB
        canal_original = imagem_resultado[:, :, i].astype(np.float32)
        canal_original[mascara_cabelo == 255] = (
                (1 - alpha) * canal_original[mascara_cabelo == 255] +
                alpha * nova_cor_rgb[i]
        )
        imagem_resultado[:, :, i] = np.clip(canal_original, 0, 255).astype(np.uint8)

    return imagem_resultado


def main():
    model_path = "models/parsenet/model.pth"
    if not os.path.exists(model_path):
        print(f"Modelo não encontrado em {model_path}")
        print("Por favor, verifique o caminho e certifique-se de que o arquivo do modelo existe.")
        return

    input_folder = "giuimages"  # Pasta correta conforme solicitado
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

    print("Usando CPU")
    net.eval()

    # Transformações para o modelo
    to_tensor = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
    ])

    # Obter arquivos de imagem
    image_files = [f for f in os.listdir(input_folder)
                   if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff'))]

    if not image_files:
        print(f"Nenhum arquivo de imagem encontrado em {input_folder}")
        return

    print(f"Processando {len(image_files)} imagens...")

    with torch.no_grad():
        for img_name in image_files:
            try:
                print(f"\n🔄 Processando: {img_name}")

                # Carregar imagem
                img_path = os.path.join(input_folder, img_name)
                img_original = cv2.imread(img_path)
                img_pil = Image.open(img_path).convert('RGB')

                # Redimensionar para o modelo
                image_resized = img_pil.resize((512, 512), Image.BILINEAR)
                img_tensor = to_tensor(image_resized)
                img_tensor = torch.unsqueeze(img_tensor, 0)

                # Obter máscara de cabelo
                print("  → Gerando máscara de cabelo...")
                if model_type == "bisenet":
                    out = net(img_tensor)[0]
                else:
                    out = net(img_tensor)

                parsing = out.squeeze(0).cpu().numpy().argmax(0)
                hair_mask = vis_parsing_maps(image_resized, parsing, stride=1)

                # Pós-processamento da máscara
                print("  → Aplicando pós-processamento...")
                clean_hair_mask = pos_processamento(hair_mask, min_area=300, kernel_size=3)

                # Redimensionar máscara para o tamanho original da imagem
                img_height, img_width = img_original.shape[:2]
                clean_hair_mask_resized = cv2.resize(clean_hair_mask, (img_width, img_height))

                # Extrair cor média do cabelo
                print("  → Extraindo cor média do cabelo...")
                cor_original = extrair_cor_media_cabelo(img_original, clean_hair_mask_resized)
                print(f"  → Cor original detectada: {cor_original}")

                # Gerar cores análogas e complementar
                print("  → Gerando paleta de cores...")
                cores_analogas = ProcessCor.cores_analogas(cor_original)
                cor_complementar = ProcessCor.cores_complementares(cor_original)

                print(f"  → Cores análogas: {cores_analogas}")
                print(f"  → Cor complementar: {cor_complementar}")

                # Aplicar cores e salvar resultados
                name_base = os.path.splitext(img_name)[0]

                # 1. Imagem original com cor detectada
                print("  → Salvando imagem original...")
                original_path = os.path.join(output_folder, f"{name_base}_original.jpg")
                cv2.imwrite(original_path, img_original)

                # 2. Primeira cor análoga
                print("  → Aplicando primeira cor análoga...")
                img_analoga1 = aplicar_cor_cabelo(img_original, clean_hair_mask_resized, cores_analogas[0])
                analoga1_path = os.path.join(output_folder, f"{name_base}_analoga1.jpg")
                cv2.imwrite(analoga1_path, img_analoga1)

                # 3. Segunda cor análoga
                print("  → Aplicando segunda cor análoga...")
                img_analoga2 = aplicar_cor_cabelo(img_original, clean_hair_mask_resized, cores_analogas[1])
                analoga2_path = os.path.join(output_folder, f"{name_base}_analoga2.jpg")
                cv2.imwrite(analoga2_path, img_analoga2)

                # 4. Cor complementar
                print("  → Aplicando cor complementar...")
                img_complementar = aplicar_cor_cabelo(img_original, clean_hair_mask_resized, cor_complementar)
                complementar_path = os.path.join(output_folder, f"{name_base}_complementar.jpg")
                cv2.imwrite(complementar_path, img_complementar)

                # Salvar também a máscara para debug
                mask_path = os.path.join(output_folder, f"{name_base}_mask.png")
                cv2.imwrite(mask_path, clean_hair_mask_resized)

                # Criar arquivo de informações das cores
                info_path = os.path.join(output_folder, f"{name_base}_cores.txt")
                with open(info_path, 'w') as f:
                    f.write(f"Imagem: {img_name}\n")
                    f.write(f"Cor original: {cor_original}\n")
                    f.write(f"Cor análoga 1: {cores_analogas[0]}\n")
                    f.write(f"Cor análoga 2: {cores_analogas[1]}\n")
                    f.write(f"Cor complementar: {cor_complementar}\n")

                print(f"  ✅ Concluído! Arquivos salvos:")
                print(f"     - Original: {original_path}")
                print(f"     - Análoga 1: {analoga1_path}")
                print(f"     - Análoga 2: {analoga2_path}")
                print(f"     - Complementar: {complementar_path}")
                print(f"     - Máscara: {mask_path}")
                print(f"     - Info: {info_path}")

            except Exception as e:
                print(f"  ❌ Erro ao processar {img_name}: {e}")
                continue

    print(f"\n🎉 Processamento concluído! Verifique a pasta '{output_folder}' para os resultados.")


if __name__ == '__main__':
    main()