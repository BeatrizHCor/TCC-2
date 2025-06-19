from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np

from PIL import Image
import torch.nn.functional as F
import torchvision.transforms as transforms
import base64

from typing import List, Dict


from corzinha import LhamaAPI

app = FastAPI(title="Hair Color Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

lhama_api = None

@app.on_event("startup")
async def load_hair_model():
    global lhama_api
    try:
        model_path = "models/parsenet/model.pth"
        lhama_api = LhamaAPI(model_path)
        print("Lhama API inicializada com sucesso")
    except Exception as e:
        print(f"Erro ao carregar modelo: {e}")
        raise

def image_to_base64(image_array):
    _, buffer = cv2.imencode('.jpg', image_array)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{img_base64}"

def process_single_image(image_array, intensity: float = 0.8):
    try:
        results = lhama_api.processa_imagem(image_array, intensity=intensity)
        
        response = {
            "cor_original": results['cor_original'],
            "cores": {
                "analogas": results['cores_analogas'],
                "complementar": results['cor_complementar']
            },
            "images": {}
        }
        
        response["images"]["original"] = image_to_base64(results['imagem_original'])
        response["images"]["analoga_1"] = image_to_base64(results['analoga_1'])
        response["images"]["analoga_2"] = image_to_base64(results['analoga_2'])
        response["images"]["complementar"] = image_to_base64(results['complementar'])
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no processamento: {str(e)}")

@app.post("/process-hair-color")
async def process_hair_color(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")
    
    if lhama_api is None:
        raise HTTPException(status_code=503, detail="Modelo não carregado")
    
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image_array = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image_array is None:
            raise HTTPException(status_code=400, detail="Não foi possível decodificar a imagem")
        
        results = process_single_image(image_array)
        
        return JSONResponse(content=results)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-hair-color-custom")
async def process_hair_color_custom(
    file: UploadFile = File(...),
    intensity: float = 0.8
):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")
    
    if lhama_api is None:
        raise HTTPException(status_code=503, detail="Modelo não carregado")
    
    if not 0.0 <= intensity <= 1.0:
        raise HTTPException(status_code=400, detail="Intensidade deve estar entre 0.0 e 1.0")
    
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image_array = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image_array is None:
            raise HTTPException(status_code=400, detail="Não foi possível decodificar a imagem")
        
        results = process_single_image(image_array, intensity=intensity)
        
        return JSONResponse(content=results)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "model_loaded": lhama_api is not None,
        "model_type": lhama_api.model_type if lhama_api else None
    }

@app.get("/")
async def root():
    return {
        "message": "Lhama Hair Color API", 
        "version": "4.3.0",
        "description": "API para simulação de cores de cabelo usando deep learning"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8080,
        reload=False,  
        workers=1     
    )