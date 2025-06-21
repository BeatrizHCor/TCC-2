import cv2
import numpy as np
import torch
from PIL import Image
import torch.nn.functional as F
import torchvision.transforms as transforms
import colorsys
from sklearn.cluster import KMeans
from typing import Tuple, List, Optional

try:
    from model import BiSeNet
    BISENET_AVAILABLE = True
except ImportError:
    BiSeNet = None
    BISENET_AVAILABLE = False

try:
    from unet import unet
    UNET_AVAILABLE = True
except ImportError:
    unet = None
    UNET_AVAILABLE = False


class ProcessCor:    
    @staticmethod
    def get_cores_analogas(hex_color: str, angle_range: int = 45) -> List[str]:
        r, g, b = [int(hex_color[i:i+2], 16) / 255.0 for i in (1, 3, 5)]
        h, l, s = colorsys.rgb_to_hls(r, g, b)
        
        s = min(s * 2.2, 1.0)
        
        cores_analogas = []
        for angle in (-angle_range, angle_range):
            h_new = (h + angle / 360.0) % 1.0
            r_new, g_new, b_new = colorsys.hls_to_rgb(h_new, l, s)
            hex_new = '#{:02x}{:02x}{:02x}'.format(
                int(r_new * 255), int(g_new * 255), int(b_new * 255)
            )
            cores_analogas.append(hex_new)
        
        return cores_analogas
    
    @staticmethod
    def get_cor_complementar(hex_color: str) -> str:
        r, g, b = [int(hex_color[i:i+2], 16) / 255.0 for i in (1, 3, 5)]
        h, l, s = colorsys.rgb_to_hls(r, g, b)
        
        h_comp = (h + 0.5) % 1.0
        r_comp, g_comp, b_comp = colorsys.hls_to_rgb(h_comp, l, s)
        
        return '#{:02x}{:02x}{:02x}'.format(
            int(r_comp * 255), int(g_comp * 255), int(b_comp * 255)
        )


class ProcessMask:    
    @staticmethod
    def advanced_post_processing(mask: np.ndarray, imagem_original: np.ndarray, 
                               min_area: int = 400) -> np.ndarray:
        print("  → Pós-processamento avançado da máscara...")
        
        if len(mask.shape) == 3:
            mask_gray = cv2.cvtColor(mask.astype(np.uint8), cv2.COLOR_BGR2GRAY)
        else:
            mask_gray = mask.astype(np.uint8)
        
        gray_img = cv2.cvtColor(imagem_original, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray_img, cv2.CV_64F).var()
        is_noisy = laplacian_var < 500
        
        kernel_size = 5 if is_noisy else 3
        min_area_adjusted = int(min_area * 0.7) if is_noisy else min_area
        
        # 1. Filtro bilateral para preservar bordas
        mask_bilateral = cv2.bilateralFilter(mask_gray, 9, 75, 75)
        
        # 2. Limiarização adaptativa
        _, binary_mask = cv2.threshold(mask_bilateral, 127, 255, cv2.THRESH_BINARY)
        
        # 3. Morfologia para limpeza inicial
        kernel_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
        opened_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_OPEN, kernel_open)
        
        # 4. Remoção de componentes pequenos
        num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(opened_mask, connectivity=8)
        clean_mask = np.zeros_like(opened_mask)
        
        for i in range(1, num_labels):
            area = stats[i, cv2.CC_STAT_AREA]
            if area >= min_area_adjusted:
                clean_mask[labels == i] = 255
        
        # 5. Fechamento para preencher buracos
        kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size * 2, kernel_size * 2))
        filled_mask = cv2.morphologyEx(clean_mask, cv2.MORPH_CLOSE, kernel_close)
        
        contours, _ = cv2.findContours(filled_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for contour in contours:
            cv2.fillPoly(filled_mask, [contour], 255)
        
        final_mask = cv2.medianBlur(filled_mask, 5)
        
        final_mask = cv2.GaussianBlur(final_mask, (3, 3), 0)
        _, final_mask = cv2.threshold(final_mask, 127, 255, cv2.THRESH_BINARY)
        
        return final_mask
    
    @staticmethod
    def mascara_suavizada(mask: np.ndarray, imagem_original: np.ndarray, 
                          kernel_size: int = 15) -> np.ndarray:
        mask_float = mask.astype(np.float32) / 255.0
        
        gray = cv2.cvtColor(imagem_original, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        kernel_edge = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        edges_dilated = cv2.dilate(edges, kernel_edge, iterations=1)
        
        mascara_blur = cv2.GaussianBlur(mask_float, (kernel_size, kernel_size), 0)
        
        edge_mask = edges_dilated.astype(np.float32) / 255.0
        mascara_final = mascara_blur * (1.0 - edge_mask * 0.3)
        
        mascara_final = cv2.bilateralFilter(
            (mascara_final * 255).astype(np.uint8), 9, 75, 75
        ).astype(np.float32) / 255.0
        
        return mascara_final


class pintar_cabelo:
    def __init__(self):
        self.color_processor = ProcessCor()
        self.mask_processor = ProcessMask()
    
    def extrair_textura_cabelo(self, image: np.ndarray, mask: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        lab_img = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        luminancia = lab_img[:, :, 0]
        
        grad_x = cv2.Sobel(luminancia, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(luminancia, cv2.CV_64F, 0, 1, ksize=3)
        gradiente_magnitude = np.sqrt(grad_x ** 2 + grad_y ** 2)
        
        return luminancia, gradiente_magnitude
    
    def aplicar_cor_cabelo_clustering(self, imagem_original: np.ndarray, hair_mask: np.ndarray, 
                                  hex_nova_cor: str, intensity: float = 0.8) -> np.ndarray:
        # clusteriza diferentes tons de cabelo

        print(f"    → Aplicando cor {hex_nova_cor} com clustering avançado...")
        
        if len(hair_mask.shape) == 3:
            hair_mask = cv2.cvtColor(hair_mask, cv2.COLOR_BGR2GRAY)
        
        pixels_cabelo = imagem_original[hair_mask > 127]
        
        if len(pixels_cabelo) < 100:
            print("    ⚠️ Poucos pixels de cabelo detectados")
            return self.aplicar_cor_cabelo_simples(imagem_original, hair_mask, hex_nova_cor, intensity)
        
        n_clusters = min(6, max(3, len(pixels_cabelo) // 100))
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        clusters = kmeans.fit_predict(pixels_cabelo)
        centers = kmeans.cluster_centers_
        
        lab_img = cv2.cvtColor(imagem_original, cv2.COLOR_BGR2LAB).astype(np.float32)
        
        nova_cor_rgb = np.array([[[
            int(hex_nova_cor[5:7], 16),  # B
            int(hex_nova_cor[3:5], 16),  # G
            int(hex_nova_cor[1:3], 16)   # R
        ]]], dtype=np.uint8)
        lab_nova_cor = cv2.cvtColor(nova_cor_rgb, cv2.COLOR_BGR2LAB)[0, 0].astype(np.float32)
        
        smooth_mask = self.mask_processor.mascara_suavizada(hair_mask, imagem_original)
        
        luminancia, gradiente = self.extrair_textura_cabelo(imagem_original, hair_mask)
        
        result = lab_img.copy()
        indices_hair = np.where(hair_mask > 127)
        
        for i, pixel_idx in enumerate(zip(indices_hair[0], indices_hair[1])):
            if i >= len(clusters):
                break
                
            y, x = pixel_idx
            cluster_id = clusters[i]
            alpha = smooth_mask[y, x]
            
            if alpha > 0.01:
                cluster_luminancia = np.mean(centers[cluster_id])
                fator_luminancia = cluster_luminancia / 255.0
                
                adapted_intensity = intensity * (0.6 + 0.4 * fator_luminancia)
                
                cor_lab_ajustada = lab_nova_cor.copy()
                cor_lab_ajustada[0] = lab_img[y, x, 0] * 0.8 + lab_nova_cor[0] * 0.2
                
                # Variação por gradiente para preservar textura
                gradiente_variation = min(gradiente[y, x] / 50.0, 1.0)
                cor_lab_ajustada[1] *= (0.7 + 0.3 * gradiente_variation)
                cor_lab_ajustada[2] *= (0.7 + 0.3 * gradiente_variation)
                
                pixel_original = lab_img[y, x]
                final_pixel = (pixel_original * (1 - alpha * adapted_intensity) + 
                             cor_lab_ajustada * (alpha * adapted_intensity))
                
                result[y, x] = final_pixel
        
        resultado_rgb = cv2.cvtColor(result.astype(np.uint8), cv2.COLOR_LAB2BGR)
        
        resultado_suavizado = cv2.bilateralFilter(resultado_rgb, 5, 50, 50)
        mask_3d = np.stack([smooth_mask, smooth_mask, smooth_mask], axis=2)
        resultado_final = (resultado_rgb * (1 - mask_3d) + resultado_suavizado * mask_3d).astype(np.uint8)
        
        return resultado_final
    
    def aplicar_cor_cabelo_simples(self, imagem_original: np.ndarray, mascara_cabelo: np.ndarray, 
                           hex_nova_cor: str, intensity: float = 0.7) -> np.ndarray:
        nova_cor_rgb = [
            int(hex_nova_cor[1:3], 16),
            int(hex_nova_cor[3:5], 16),
            int(hex_nova_cor[5:7], 16)
        ]
        
        result = imagem_original.copy()
        
        if len(mascara_cabelo.shape) == 3:
            mascara_cabelo = cv2.cvtColor(mascara_cabelo, cv2.COLOR_BGR2GRAY)
        
        for i in range(3):
            channel = result[:, :, i].astype(np.float32)
            channel[mascara_cabelo == 255] = (
                (1 - intensity) * channel[mascara_cabelo == 255] + 
                intensity * nova_cor_rgb[i]
            )
            result[:, :, i] = np.clip(channel, 0, 255).astype(np.uint8)
        
        return result
    
    def extrai_media_cabelo(self, imagem_original: np.ndarray, mascara_cabelo: np.ndarray) -> str:
        if len(imagem_original.shape) == 3 and imagem_original.shape[2] == 3:
            img_rgb = cv2.cvtColor(imagem_original, cv2.COLOR_BGR2RGB)
        else:
            img_rgb = imagem_original
        
        if len(mascara_cabelo.shape) == 3:
            mascara_cabelo = cv2.cvtColor(mascara_cabelo, cv2.COLOR_BGR2GRAY)
        
        pixels_cabelo = img_rgb[mascara_cabelo == 255]
        
        if len(pixels_cabelo) == 0:
            print("Nenhum pixel de cabelo encontrado!")
            return "#8B4513"  
        
        cor_media = np.median(pixels_cabelo, axis=0)
        r, g, b = int(cor_media[0]), int(cor_media[1]), int(cor_media[2])
        
        return '#{:02x}{:02x}{:02x}'.format(r, g, b)


class ModelLoader:
    #carregamento dos modelos
    @staticmethod
    def load_model(model_path: str) -> Tuple[torch.nn.Module, str]:
        print("Analisando modelo salvo...")
        
        checkpoint = torch.load(model_path, map_location='cpu')
        keys = list(checkpoint.keys())
        print(f"Encontrados {len(keys)} grupos de parâmetros no modelo")
        
        bisenet_keys = any('cp.resnet' in key for key in keys)
        unet_keys = any('conv1.conv1' in key or 'up_concat' in key for key in keys)
        
        print(f"Estrutura BiSeNet detectada: {bisenet_keys}")
        print(f"Estrutura U-Net detectada: {unet_keys}")
        
        if unet_keys and UNET_AVAILABLE:
            print("Carregando como modelo U-Net...")
            net = unet()
            net.load_state_dict(checkpoint)
            return net, "unet"
        elif bisenet_keys and BISENET_AVAILABLE:
            print("Carregando como modelo BiSeNet...")
            net = BiSeNet(n_classes=19)
            net.load_state_dict(checkpoint)
            return net, "bisenet"
        else:
            if BISENET_AVAILABLE:
                try:
                    print("Tentando carregar como BiSeNet...")
                    net = BiSeNet(n_classes=19)
                    net.load_state_dict(checkpoint)
                    return net, "bisenet"
                except RuntimeError as e:
                    print(f"BiSeNet falhou: {e}")
            
            if UNET_AVAILABLE:
                try:
                    print("Tentando carregar como U-Net...")
                    net = unet()
                    net.load_state_dict(checkpoint)
                    return net, "unet"
                except RuntimeError as e:
                    print(f"U-Net falhou: {e}")
            
            raise RuntimeError("Não foi possível carregar o modelo com nenhuma arquitetura disponível")


def extrai_mascara_cabelo(parsing: np.ndarray) -> np.ndarray:
    mascara_cabelo = np.zeros((parsing.shape[0], parsing.shape[1]), dtype=np.uint8)
    mascara_cabelo[parsing == 13] = 255  # Classe 13 = cabelo no dataset CelebAMask-HQ
    return mascara_cabelo


class LhamaAPI:
    
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.net = None
        self.model_type = None
        self.colorizer = pintar_cabelo()
        self.transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
        ])
        
        self._load_model()
    
    def _load_model(self):
        try:
            self.net, self.model_type = ModelLoader.load_model(self.model_path)
            print(f"Modelo {self.model_type} carregado com sucesso")
            self.net.eval()
        except Exception as e:
            raise RuntimeError(f"Falha ao carregar modelo: {e}")
    
    def processa_imagem(self, image: np.ndarray, intensity: float = 0.8) -> dict:
        print("Iniciando processamento da imagem...")
        
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        img_pil = Image.fromarray(img_rgb)
        
        image_resized = img_pil.resize((512, 512), Image.BILINEAR)
        img_tensor = self.transform(image_resized)
        img_tensor = torch.unsqueeze(img_tensor, 0)
        
        print("  → Gerando máscara de cabelo...")
        with torch.no_grad():
            if self.model_type == "bisenet":
                out = self.net(img_tensor)[0]
            else:
                out = self.net(img_tensor)
        
        parsing = out.squeeze(0).cpu().numpy().argmax(0)
        mascara_cabelo = extrai_mascara_cabelo(parsing)
        
        img_height, img_width = image.shape[:2]
        mascara_cabelo_resized = cv2.resize(mascara_cabelo, (img_width, img_height))
        
        print("  → Aplicando pós-processamento avançado...")
        clean_mascara_cabelo = self.colorizer.mask_processor.advanced_post_processing(
            mascara_cabelo_resized, image, min_area=500
        )
        
        print("  → Extraindo cor original do cabelo...")
        cor_original = self.colorizer.extrai_media_cabelo(image, clean_mascara_cabelo)
        print(f"  → Cor original detectada: {cor_original}")
        
        print("  → Gerando paleta de cores...")
        cores_analogas = self.colorizer.color_processor.get_cores_analogas(cor_original)
        cor_complementar = self.colorizer.color_processor.get_cor_complementar(cor_original)
        
        results = {
            'imagem_original': image,
            'mascara_cabelo': clean_mascara_cabelo,
            'cor_original': cor_original,
            'cores_analogas': cores_analogas,
            'cor_complementar': cor_complementar
        }
        
        print("  → Aplicando cores análogas...")
        results['analoga_1'] = self.colorizer.aplicar_cor_cabelo_clustering(
            image, clean_mascara_cabelo, cores_analogas[0], intensity
        )
        
        results['analoga_2'] = self.colorizer.aplicar_cor_cabelo_clustering(
            image, clean_mascara_cabelo, cores_analogas[1], intensity * 0.9
        )
        
        print("  → Aplicando cor complementar...")
        results['complementar'] = self.colorizer.aplicar_cor_cabelo_clustering(
            image, clean_mascara_cabelo, cor_complementar, intensity * 1.1
        )
        
        print("Processamento concluído!")
        return results