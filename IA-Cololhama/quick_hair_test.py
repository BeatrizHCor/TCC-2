import os
import cv2
import numpy as np
import torch
from PIL import Image
import torch.nn.functional as F
import torchvision.transforms as transforms

# Try to import both possible model architectures
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


def vis_parsing_maps(im, parsing_anno, stride):
    """Extract only hair and create mask"""
    # Hair is class 13 according to their documentation
    hair_mask = np.zeros((parsing_anno.shape[0], parsing_anno.shape[1], 3))
    hair_mask[parsing_anno == 13] = [255, 255, 255]  # White for hair
    return hair_mask


def load_model(model_path):
    """Try to load the correct model based on the saved state dict"""
    print("Analyzing saved model...")

    # Load the checkpoint to inspect its structure
    checkpoint = torch.load(model_path, map_location='cpu')

    # Check the keys to determine model type
    keys = list(checkpoint.keys())
    print(f"Found {len(keys)} parameter groups in model")

    # Check for BiSeNet keys
    bisenet_keys = any('cp.resnet' in key for key in keys)
    # Check for U-Net keys
    unet_keys = any('conv1.conv1' in key or 'up_concat' in key for key in keys)

    print(f"BiSeNet structure detected: {bisenet_keys}")
    print(f"U-Net structure detected: {unet_keys}")

    if unet_keys and unet is not None:
        print("Loading as U-Net model...")
        net = unet()
        net.load_state_dict(checkpoint)
        return net, "unet"
    elif bisenet_keys and BiSeNet is not None:
        print("Loading as BiSeNet model...")
        net = BiSeNet(n_classes=19)
        net.load_state_dict(checkpoint)
        return net, "bisenet"
    else:
        # If we can't determine, try both
        if BiSeNet is not None:
            try:
                print("Attempting to load as BiSeNet...")
                net = BiSeNet(n_classes=19)
                net.load_state_dict(checkpoint)
                return net, "bisenet"
            except RuntimeError as e:
                print(f"BiSeNet failed: {e}")

        if unet is not None:
            try:
                print("Attempting to load as U-Net...")
                net = unet()
                net.load_state_dict(checkpoint)
                return net, "unet"
            except RuntimeError as e:
                print(f"U-Net failed: {e}")

        raise RuntimeError("Could not load model with either architecture")


def main():
    # Check if model exists
    model_path = "models/parsenet/model.pth"
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}")
        print("Please check the path and ensure the model file exists.")
        return

    # Setup
    input_folder = "giuimages"
    output_folder = "hair_results"

    if not os.path.exists(input_folder):
        print(f"Input folder '{input_folder}' not found!")
        return

    os.makedirs(output_folder, exist_ok=True)

    # Load model
    print("Loading model...")
    try:
        net, model_type = load_model(model_path)
        print(f"Successfully loaded {model_type} model")
    except Exception as e:
        print(f"Failed to load model: {e}")
        return

    # Force CPU usage
    print("Using CPU")
    net.eval()

    # Process images
    to_tensor = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
    ])

    # Get image files
    image_files = [f for f in os.listdir(input_folder)
                   if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff'))]

    if not image_files:
        print(f"No image files found in {input_folder}")
        return

    print(f"Processing {len(image_files)} images...")

    with torch.no_grad():
        for img_name in image_files:
            try:
                print(f"Processing: {img_name}")

                # Load image
                img_path = os.path.join(input_folder, img_name)
                img = Image.open(img_path).convert('RGB')

                # Resize to 512x512 (common size for face parsing)
                image = img.resize((512, 512), Image.BILINEAR)
                img_tensor = to_tensor(image)
                img_tensor = torch.unsqueeze(img_tensor, 0)

                # Get parsing result
                if model_type == "bisenet":
                    # BiSeNet returns multiple outputs
                    out = net(img_tensor)[0]  # Take the main output
                else:
                    # U-Net returns single output
                    out = net(img_tensor)

                # Convert to parsing map
                parsing = out.squeeze(0).cpu().numpy().argmax(0)

                # Create hair mask
                hair_mask = vis_parsing_maps(image, parsing, stride=1)

                # Save result
                name_base = os.path.splitext(img_name)[0]
                output_path = os.path.join(output_folder, f"{name_base}_hair.png")
                cv2.imwrite(output_path, hair_mask)

                print(f"  → Saved: {output_path}")

                # Also save the full parsing result for debugging
                debug_path = os.path.join(output_folder, f"{name_base}_parsing.png")
                cv2.imwrite(debug_path, parsing.astype(np.uint8) * 13)  # Scale for visibility

            except Exception as e:
                print(f"  Error processing {img_name}: {e}")
                continue

    print("Done!")


if __name__ == '__main__':
    main()

