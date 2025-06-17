import os
import cv2
import numpy as np
import torch
from PIL import Image
import torch.nn.functional as F
import torchvision.transforms as transforms
from scipy import ndimage
import colorsys
from sklearn.cluster import KMeans

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


def pos_processamento(mask, min_area=300, kernel_size=3):
    print("  → Pós-processando máscara com técnica híbrida...")

    # Converter para escala de cinza, se necessário
    if len(mask.shape) == 3:
        mask_gray = cv2.cvtColor(mask.astype(np.uint8), cv2.COLOR_BGR2GRAY)
    else:
        mask_gray = mask.astype(np.uint8)

    # Binarização simples
    _, binary_mask = cv2.threshold(mask_gray, 127, 255, cv2.THRESH_BINARY)

    # Abertura morfológica para remover pontos soltos (ruído)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
    opened_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_OPEN, kernel)

    # Remoção de componentes pequenos (filtros por área)
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(opened_mask, connectivity=8)
    clean_mask = np.zeros_like(opened_mask)

    for i in range(1, num_labels):  # pula o fundo (label 0)
        area = stats[i, cv2.CC_STAT_AREA]
        if area >= min_area:
            clean_mask[labels == i] = 255

    # Fechamento para preencher buracos internos
    closing_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size * 2, kernel_size * 2))
    filled_mask = cv2.morphologyEx(clean_mask, cv2.MORPH_CLOSE, closing_kernel)

    # Contorno e preenchimento para garantir que não ficou falha interna
    contours, _ = cv2.findContours(filled_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    final_mask = filled_mask.copy()
    for contour in contours:
        cv2.fillPoly(final_mask, [contour], 255)

    # Suavização das bordas
    final_mask = cv2.GaussianBlur(final_mask, (3, 3), 0)
    _, final_mask = cv2.threshold(final_mask, 127, 255, cv2.THRESH_BINARY)

    # Retorna RGB se necessário
    if len(mask.shape) == 3:
        final_rgb = np.zeros_like(mask)
        final_rgb[final_mask == 255] = [255, 255, 255]
        return final_rgb

    return final_mask


def extrair_textura_cabelo(imagem, mascara):
    lab_img = cv2.cvtColor(imagem, cv2.COLOR_BGR2LAB)
    luminancia = lab_img[:, :, 0]
    grad_x = cv2.Sobel(luminancia, cv2.CV_64F, 1, 0, ksize=3)
    grad_y = cv2.Sobel(luminancia, cv2.CV_64F, 0, 1, ksize=3)
    gradiente_magnitude = np.sqrt(grad_x ** 2 + grad_y ** 2)

    return luminancia, gradiente_magnitude


def criar_mascara_suavizada(mascara, imagem_original, kernel_size=15):
    mascara_float = mascara.astype(np.float32) / 255.0

    gray = cv2.cvtColor(imagem_original, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    kernel_edge = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    edges_dilated = cv2.dilate(edges, kernel_edge, iterations=1)

    mascara_blur = cv2.GaussianBlur(mascara_float, (kernel_size, kernel_size), 0)

    edge_mask = edges_dilated.astype(np.float32) / 255.0
    mascara_final = mascara_blur * (1.0 - edge_mask * 0.3)


    mascara_final = cv2.bilateralFilter(
        (mascara_final * 255).astype(np.uint8),
        9, 75, 75
    ).astype(np.float32) / 255.0

    return mascara_final


def ajustar_cor_por_luminosidade(cor_hex, luminosidade):
    r = int(cor_hex[1:3], 16) / 255.0
    g = int(cor_hex[3:5], 16) / 255.0
    b = int(cor_hex[5:7], 16) / 255.0

    h, s, v = colorsys.rgb_to_hsv(r, g, b)

    lum_norm = luminosidade / 255.0

    s_ajustada = s * (0.7 + 0.3 * lum_norm)

    v_ajustada = v * (0.8 + 0.4 * lum_norm)

    r_adj, g_adj, b_adj = colorsys.hsv_to_rgb(h, s_ajustada, v_ajustada)

    return np.array([r_adj * 255, g_adj * 255, b_adj * 255])


def aplicar_cor_cabelo_avancado(imagem_original, mascara_cabelo, nova_cor_hex, intensidade=0.8):
    print(f"    → Aplicando cor {nova_cor_hex} com intensidade {intensidade}")


    resultado = imagem_original.copy().astype(np.float32)

    if len(mascara_cabelo.shape) == 3:
        mascara_cabelo = cv2.cvtColor(mascara_cabelo, cv2.COLOR_BGR2GRAY)

    luminancia, gradiente = extrair_textura_cabelo(imagem_original, mascara_cabelo)

    print("    → Criando máscara suavizada...")
    mascara_suave = criar_mascara_suavizada(mascara_cabelo, imagem_original)

    lab_img = cv2.cvtColor(imagem_original, cv2.COLOR_BGR2LAB).astype(np.float32)

    nova_cor_rgb = np.array([[[
        int(nova_cor_hex[5:7], 16),  # B
        int(nova_cor_hex[3:5], 16),  # G
        int(nova_cor_hex[1:3], 16)  # R
    ]]], dtype=np.uint8)
    nova_cor_lab = cv2.cvtColor(nova_cor_rgb, cv2.COLOR_BGR2LAB)[0, 0].astype(np.float32)

    for y in range(resultado.shape[0]):
        for x in range(resultado.shape[1]):
            alpha = mascara_suave[y, x]

            if alpha > 0.01: 
                lum_original = lab_img[y, x, 0]

                cor_ajustada_lab = nova_cor_lab.copy()

                cor_ajustada_lab[0] = lum_original * 0.9 + nova_cor_lab[0] * 0.1

                variacao_grad = min(gradiente[y, x] / 50.0, 1.0)
                cor_ajustada_lab[1] *= (0.8 + 0.2 * variacao_grad)
                cor_ajustada_lab[2] *= (0.8 + 0.2 * variacao_grad)

                pixel_original = lab_img[y, x]
                pixel_final = pixel_original * (1 - alpha * intensidade) + cor_ajustada_lab * (alpha * intensidade)

                lab_img[y, x] = pixel_final

    resultado_final = cv2.cvtColor(lab_img.astype(np.uint8), cv2.COLOR_LAB2BGR)

    print("    → Aplicando suavização final...")
    resultado_suavizado = cv2.bilateralFilter(resultado_final, 5, 50, 50)

    mascara_3d = np.stack([mascara_suave, mascara_suave, mascara_suave], axis=2)
    resultado_final = (resultado_final * (1 - mascara_3d) +
                       resultado_suavizado * mascara_3d).astype(np.uint8)

    return resultado_final


def aplicar_cor_cabelo_com_clustering(imagem_original, mascara_cabelo, nova_cor_hex, intensidade=0.75):
    print(f"    → Aplicando cor {nova_cor_hex} com clustering...")
    if len(mascara_cabelo.shape) == 3:
        mascara_cabelo = cv2.cvtColor(mascara_cabelo, cv2.COLOR_BGR2GRAY)

    pixels_cabelo = imagem_original[mascara_cabelo > 127]

    if len(pixels_cabelo) < 100:
        print("    ⚠️ Poucos pixels de cabelo, usando método avançado")
        return aplicar_cor_cabelo_avancado(imagem_original, mascara_cabelo, nova_cor_hex, intensidade)


    n_clusters = min(5, len(pixels_cabelo) // 50) 
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(pixels_cabelo)
    centros = kmeans.cluster_centers_

    resultado = imagem_original.copy()

    for i in range(n_clusters):
        mascara_cluster = np.zeros_like(mascara_cabelo)
        indices_cluster = np.where(mascara_cabelo > 127)

        cluster_mask = clusters == i
        if not np.any(cluster_mask):
            continue

        pixel_indices = np.where(cluster_mask)[0]
        for idx in pixel_indices:
            if idx < len(indices_cluster[0]):
                y, x = indices_cluster[0][idx], indices_cluster[1][idx]
                mascara_cluster[y, x] = 255

        lum_cluster = np.mean(centros[i])
        intensidade_ajustada = intensidade * (0.7 + 0.3 * (lum_cluster / 255.0))

        resultado = aplicar_cor_cabelo_avancado(
            resultado, mascara_cluster, nova_cor_hex, intensidade_ajustada
        )

    return resultado


def aplicar_cor_cabelo_simples(imagem_original, mascara_cabelo, nova_cor_hex, intensidade=0.7):
    nova_cor_rgb = [
        int(nova_cor_hex[1:3], 16),
        int(nova_cor_hex[3:5], 16),
        int(nova_cor_hex[5:7], 16)
    ]

    imagem_resultado = imagem_original.copy()

    if len(mascara_cabelo.shape) == 3:
        mascara_cabelo = cv2.cvtColor(mascara_cabelo, cv2.COLOR_BGR2GRAY)

    for i in range(3):
        canal_original = imagem_resultado[:, :, i].astype(np.float32)
        canal_original[mascara_cabelo == 255] = (
                (1 - intensidade) * canal_original[mascara_cabelo == 255] +
                intensidade * nova_cor_rgb[i]
        )
        imagem_resultado[:, :, i] = np.clip(canal_original, 0, 255).astype(np.uint8)

    return imagem_resultado


def aplicar_cor_cabelo(imagem_original, mascara_cabelo, nova_cor_hex, metodo="avancado", intensidade=0.8):
    """
    Função principal melhorada para aplicar cor no cabelo

    Args:
        imagem_original: Imagem BGR original
        mascara_cabelo: Máscara binária do cabelo
        nova_cor_hex: Nova cor em formato hex
        metodo: "simples", "avancado" ou "clustering"
        intensidade: Intensidade da cor (0.0 a 1.0)
    """

    if metodo == "clustering":
        return aplicar_cor_cabelo_com_clustering(imagem_original, mascara_cabelo, nova_cor_hex, intensidade)
    elif metodo == "avancado":
        return aplicar_cor_cabelo_avancado(imagem_original, mascara_cabelo, nova_cor_hex, intensidade)
    else:
        return aplicar_cor_cabelo_simples(imagem_original, mascara_cabelo, nova_cor_hex, intensidade)


def pos_processamento_inteligente(mask, imagem_original, min_area=300):
    print("    → Pós-processamento inteligente da máscara...")

    if len(mask.shape) == 3:
        mask_gray = cv2.cvtColor(mask.astype(np.uint8), cv2.COLOR_BGR2GRAY)
    else:
        mask_gray = mask.astype(np.uint8)

    gray_img = cv2.cvtColor(imagem_original, cv2.COLOR_BGR2GRAY)

    laplacian_var = cv2.Laplacian(gray_img, cv2.CV_64F).var()
    is_noisy = laplacian_var < 500

    kernel_size = 5 if is_noisy else 3
    min_area = min_area * 0.7 if is_noisy else min_area

    mask_bilateral = cv2.bilateralFilter(mask_gray, 9, 75, 75)

    _, binary_mask = cv2.threshold(mask_bilateral, 127, 255, cv2.THRESH_BINARY)

    kernel_opening = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
    cleaned_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_OPEN, kernel_opening)

    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(cleaned_mask, connectivity=8)

    clean_mask = np.zeros_like(cleaned_mask)
    for i in range(1, num_labels):
        area = stats[i, cv2.CC_STAT_AREA]
        if area >= min_area:
            clean_mask[labels == i] = 255

    kernel_closing = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size * 2, kernel_size * 2))
    filled_mask = cv2.morphologyEx(clean_mask, cv2.MORPH_CLOSE, kernel_closing)

    final_mask = cv2.medianBlur(filled_mask, 5)

    return final_mask


def vis_parsing_maps(im, parsing_anno, stride):
    hair_mask = np.zeros((parsing_anno.shape[0], parsing_anno.shape[1]))
    hair_mask[parsing_anno == 13] = 255  
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
    if len(imagem_original.shape) == 3 and imagem_original.shape[2] == 3:
        img_rgb = cv2.cvtColor(imagem_original, cv2.COLOR_BGR2RGB)
    else:
        img_rgb = imagem_original

    if len(mascara_cabelo.shape) == 3:
        mascara_cabelo = cv2.cvtColor(mascara_cabelo, cv2.COLOR_BGR2GRAY)

    pixels_cabelo = img_rgb[mascara_cabelo == 255]

    if len(pixels_cabelo) == 0:
        print("  ⚠️ Nenhum pixel de cabelo encontrado!")
        return "#000000" 

    cor_media_rgb = np.mean(pixels_cabelo, axis=0)
    r, g, b = int(cor_media_rgb[0]), int(cor_media_rgb[1]), int(cor_media_rgb[2])

    hex_color = '#{:02x}{:02x}{:02x}'.format(r, g, b)
    return hex_color


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

    print("Usando CPU")
    net.eval()

    to_tensor = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
    ])

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

                img_path = os.path.join(input_folder, img_name)
                img_original = cv2.imread(img_path)
                img_pil = Image.open(img_path).convert('RGB')


                image_resized = img_pil.resize((512, 512), Image.BILINEAR)
                img_tensor = to_tensor(image_resized)
                img_tensor = torch.unsqueeze(img_tensor, 0)

                print("  → Gerando máscara de cabelo...")
                if model_type == "bisenet":
                    out = net(img_tensor)[0]
                else:
                    out = net(img_tensor)

                parsing = out.squeeze(0).cpu().numpy().argmax(0)
                hair_mask = vis_parsing_maps(image_resized, parsing, stride=1)

                img_height, img_width = img_original.shape[:2]
                hair_mask_resized = cv2.resize(hair_mask, (img_width, img_height))

                print("  → Aplicando pós-processamento personalizado...")
                clean_hair_mask = pos_processamento_inteligente(hair_mask_resized, img_original, min_area=500)


                print("  → Extraindo cor média do cabelo...")
                cor_original = extrair_cor_media_cabelo(img_original, clean_hair_mask)
                print(f"  → Cor original detectada: {cor_original}")

                print("  → Gerando paleta de cores...")
                cores_analogas = ProcessCor.cores_analogas(cor_original)
                cor_complementar = ProcessCor.cores_complementares(cor_original)

                print(f"  → Cores análogas: {cores_analogas}")
                print(f"  → Cor complementar: {cor_complementar}")

                name_base = os.path.splitext(img_name)[0]

                print("  → Salvando imagem original...")
                original_path = os.path.join(output_folder, f"{name_base}_original.jpg")
                cv2.imwrite(original_path, img_original)

                print("  → Aplicando primeira cor análoga...")
                img_analoga1 = aplicar_cor_cabelo(
                    img_original, clean_hair_mask, cores_analogas[0],
                    metodo="avancado", intensidade=0.8
                )
                analoga1_path = os.path.join(output_folder, f"{name_base}_analoga1.jpg")
                cv2.imwrite(analoga1_path, img_analoga1)

                print("  → Aplicando segunda cor análoga...")
                img_analoga2 = aplicar_cor_cabelo(
                    img_original, clean_hair_mask, cores_analogas[1],
                    metodo="clustering", intensidade=0.75
                )
                analoga2_path = os.path.join(output_folder, f"{name_base}_analoga2.jpg")
                cv2.imwrite(analoga2_path, img_analoga2)

                print("  → Aplicando cor complementar...")
                img_complementar = aplicar_cor_cabelo(
                    img_original, clean_hair_mask, cor_complementar,
                    metodo="avancado", intensidade=0.85
                )
                complementar_path = os.path.join(output_folder, f"{name_base}_complementar.jpg")
                cv2.imwrite(complementar_path, img_complementar)

                info_path = os.path.join(output_folder, f"{name_base}_cores.txt")
                with open(info_path, 'w') as f:
                    f.write(f"Imagem: {img_name}\n")
                    f.write(f"Cor original: {cor_original}\n")
                    f.write(f"Cor análoga 1: {cores_analogas[0]}\n")
                    f.write(f"Cor análoga 2: {cores_analogas[1]}\n")
                    f.write(f"Cor complementar: {cor_complementar}\n")

                print(f" Concluído! Arquivos salvos:")
                print(f"     - Original: {original_path}")
                print(f"     - Análoga 1: {analoga1_path}")
                print(f"     - Análoga 2: {analoga2_path}")
                print(f"     - Complementar: {complementar_path}")
                print(f"     - Info: {info_path}")

            except Exception as e:
                print(f" Erro ao processar {img_name}: {e}")
                continue

    print(f"\n🎉 Processamento concluído! Verifique a pasta '{output_folder}' para os resultados.")


if __name__ == '__main__':
    main()