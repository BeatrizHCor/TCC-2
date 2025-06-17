from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import torch
from PIL import Image
import torch.nn.functional as F
import torchvision.transforms as transforms
import base64
import io
import os
from typing import List, Dict
import tempfile
import uuid

# Importar suas classes e funções existentes
from corzinha import (
    ProcessCor, 
    pos_processamento, 
    aplicar_cor_cabelo,
    extrair_cor_media_cabelo,
    load_model,
    vis_parsing_maps
)

app = FastAPI(title="Hair Color Simulator API")

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL do seu Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variáveis globais para o modelo
model = None
model_type = None

@app.on_event("startup")
async def load_hair_model():
    """Carrega o modelo na inicialização da API"""
    global model, model_type
    try:
        model_path = "models/parsenet/model.pth"
        model, model_type = load_model(model_path)
        model.eval()
        print(f"Modelo {model_type} carregado com sucesso")
    except Exception as e:
        print(f"Erro ao carregar modelo: {e}")
        raise

def image_to_base64(image_array):
    """Converte array numpy para base64"""
    _, buffer = cv2.imencode('.jpg', image_array)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{img_base64}"

def process_single_image(image_array):
    """Processa uma única imagem e retorna os resultados"""
    try:
        # Converter para PIL Image
        img_pil = Image.fromarray(cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB))
        
        # Redimensionar para o modelo
        image_resized = img_pil.resize((512, 512), Image.BILINEAR)
        
        # Transformações para o modelo
        to_tensor = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
        ])
        
        img_tensor = to_tensor(image_resized)
        img_tensor = torch.unsqueeze(img_tensor, 0)
        
        # Gerar máscara de cabelo
        with torch.no_grad():
            if model_type == "bisenet":
                out = model(img_tensor)[0]
            else:
                out = model(img_tensor)
            
            parsing = out.squeeze(0).cpu().numpy().argmax(0)
            hair_mask = vis_parsing_maps(image_resized, parsing, stride=1)
        
        # Redimensionar máscara para tamanho original
        img_height, img_width = image_array.shape[:2]
        hair_mask_resized = cv2.resize(hair_mask, (img_width, img_height))
        
        # Aplicar pós-processamento
        clean_hair_mask = pos_processamento(
            hair_mask_resized,
            min_area=500,
            kernel_size=3
        )
        
        # Extrair cor original
        cor_original = extrair_cor_media_cabelo(image_array, clean_hair_mask)
        
        # Gerar paleta de cores
        cores_analogas = ProcessCor.cores_analogas(cor_original)
        cor_complementar = ProcessCor.cores_complementares(cor_original)
        
        # Aplicar transformações de cor
        results = {
            "original_color": cor_original,
            "colors": {
                "analogous": cores_analogas,
                "complementary": cor_complementar
            },
            "images": {}
        }
        
        # Imagem original
        results["images"]["original"] = image_to_base64(image_array)
        
        # Aplicar cores análogas
        img_analoga1 = aplicar_cor_cabelo(
            image_array, clean_hair_mask, cores_analogas[0],
            metodo="avancado", intensidade=0.8
        )
        results["images"]["analogous_1"] = image_to_base64(img_analoga1)
        
        img_analoga2 = aplicar_cor_cabelo(
            image_array, clean_hair_mask, cores_analogas[1],
            metodo="clustering", intensidade=0.75
        )
        results["images"]["analogous_2"] = image_to_base64(img_analoga2)
        
        # Aplicar cor complementar
        img_complementar = aplicar_cor_cabelo(
            image_array, clean_hair_mask, cor_complementar,
            metodo="avancado", intensidade=0.85
        )
        results["images"]["complementary"] = image_to_base64(img_complementar)
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no processamento: {str(e)}")

@app.post("/process-hair-color")
async def process_hair_color(file: UploadFile = File(...)):
    """Endpoint principal para processar imagem"""
    
    # Validar tipo de arquivo
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")
    
    try:
        # Ler arquivo
        contents = await file.read()
        
        # Converter para array numpy
        nparr = np.frombuffer(contents, np.uint8)
        image_array = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image_array is None:
            raise HTTPException(status_code=400, detail="Não foi possível decodificar a imagem")
        
        # Processar imagem
        results = process_single_image(image_array)
        
        return JSONResponse(content=results)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Endpoint de verificação de saúde"""
    return {"status": "healthy", "model_loaded": model is not None}

@app.get("/")
async def root():
    return {"message": "Hair Color Simulator API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)