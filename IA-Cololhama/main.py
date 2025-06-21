from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import traceback
import base64

from corzinha import LhamaAPI

app = FastAPI(title="Lhama API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

lhama_api = None

@app.on_event("startup")
async def carregar_modelo():
    global lhama_api
    try:
        model_path = "models/parsenet/model.pth"
        lhama_api = LhamaAPI(model_path)
        print("Lhama API inicializada com sucesso")
    except Exception as e:
        print(f"Erro ao carregar modelo: {e}")
        raise

def imagem_para_base64(imagem_array: np.ndarray) -> str:
    _, buffer = cv2.imencode('.jpg', imagem_array)
    img_b64 = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{img_b64}"

def processar_imagem_unica(imagem_array: np.ndarray, intensidade: float = 0.8) -> dict:
    try:
        resultados = lhama_api.processa_imagem(imagem_array, intensity=intensidade)

        resposta = {
            "cor_original": resultados['cor_original'],
            "cores": {
                "analogas": resultados['cores_analogas'],
                "complementar": resultados['cor_complementar']
            },
            "images": {
                "original": imagem_para_base64(resultados['imagem_original']),
                "analoga_1": imagem_para_base64(resultados['analoga_1']),
                "analoga_2": imagem_para_base64(resultados['analoga_2']),
                "complementar": imagem_para_base64(resultados['complementar']),
            }
        }
        return resposta

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erro no processamento: {str(e)}")

@app.post("/processamento-cor-cabelo")
async def processar_cor_cabelo(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")

    if lhama_api is None:
        raise HTTPException(status_code=503, detail="Modelo não carregado")

    try:
        conteudo = await file.read()
        np_array = np.frombuffer(conteudo, np.uint8)
        imagem_array = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if imagem_array is None:
            raise HTTPException(status_code=400, detail="Não foi possível decodificar a imagem")

        resultados = processar_imagem_unica(imagem_array)

        return JSONResponse(content=resultados)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/procesamento-cor-cabelo-custom")
async def processar_cor_cabelo_custom(
    file: UploadFile = File(...),
    intensidade: float = 0.8,
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")

    if lhama_api is None:
        raise HTTPException(status_code=503, detail="Modelo não carregado")

    if not 0.0 <= intensidade <= 1.0:
        raise HTTPException(status_code=400, detail="Intensidade deve estar entre 0.0 e 1.0")

    try:
        conteudo = await file.read()
        np_array = np.frombuffer(conteudo, np.uint8)
        imagem_array = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if imagem_array is None:
            raise HTTPException(status_code=400, detail="Não foi possível decodificar a imagem")

        resultados = processar_imagem_unica(imagem_array, intensidade=intensidade)

        return JSONResponse(content=resultados)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def checar_status():
    return {
        "status": "healthy",
        "modelo_carregado": lhama_api is not None,
        "tipo_modelo": getattr(lhama_api, "model_type", None),
    }

@app.get("/")
async def raiz():
    return {
        "mensagem": "Lhama API",
        "versao": "4.3.0",
        "descricao": "API para simulação de cores de cabelo usando deep learning",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app", 
        host="0.0.0.0",
        port=8080,
        reload=False,
        workers=1,
    )
