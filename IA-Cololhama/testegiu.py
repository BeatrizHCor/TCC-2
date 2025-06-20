import os
import sys
import torch
import torch.nn.functional as F
import numpy as np
from torchvision import transforms
from PIL import Image
import matplotlib.pyplot as plt


sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from face_parsing.model import BiSeNet

output_dir = './output_images'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)


image_folder = './giuimages'


transform = transforms.Compose([
    transforms.Resize((512, 512)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


n_classes = 19
model = BiSeNet(n_classes=n_classes)
model_path = './models/parsenet/model.pth'  # Caminho do .pth
model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()
model.to(device)


color_map = {
    0: [0, 0, 0],        # Fundo
    1: [204, 0, 0],      # Pele
    2: [76, 153, 0],     # Sobrancelha esquerda
    3: [204, 204, 0],    # Sobrancelha direita
    4: [51, 51, 255],    # Olho esquerdo
    5: [204, 0, 204],    # Olho direito
    6: [0, 255, 255],    # Nariz
    7: [255, 204, 204],  # Lábio superior
    8: [102, 51, 0],     # Lábio inferior
    9: [255, 0, 0],      # Cabelo
    10: [102, 204, 0],   # Chapéu
    11: [255, 255, 0],   # Óculos
    12: [0, 0, 153],     # Brinco
    13: [0, 0, 204],     # Colar
    14: [255, 51, 153],  # Roupa
    15: [0, 204, 204],   # Pescoço
    16: [0, 51, 0],      # Pele do pescoço
    17: [255, 153, 51],  # Boca
    18: [0, 204, 0]      # Outros
}


for filename in os.listdir(image_folder):
    if filename.lower().endswith(('.jpg', '.png', '.jpeg')):
        image_path = os.path.join(image_folder, filename)
        print(f"Processando: {filename}")

        original_image = Image.open(image_path).convert('RGB')
        original_image = original_image.resize((512, 512))


        image_tensor = transform(original_image).unsqueeze(0).to(device)

        with torch.no_grad():
            out = model(image_tensor)[0]


        out = F.softmax(out, dim=1)
        _, predicted = torch.max(out, dim=1)
        predicted = predicted.squeeze().cpu().numpy()


        segmentation_map = np.zeros((512, 512, 3), dtype=np.uint8)
        for class_idx, color in color_map.items():
            segmentation_map[predicted == class_idx] = color


        result_image = Image.fromarray(segmentation_map)
        output_path = os.path.join(output_dir, f"parsed_{filename}")
        result_image.save(output_path)


        plt.figure(figsize=(12, 6))
        plt.subplot(1, 2, 1)
        plt.imshow(original_image)
        plt.title("Imagem Original")
        plt.axis('off')

        plt.subplot(1, 2, 2)
        plt.imshow(segmentation_map)
        plt.title("Face Parsing")
        plt.axis('off')

        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, f"comparison_{filename}"))
        plt.show()

print("Processamento concluído com sucesso!")
