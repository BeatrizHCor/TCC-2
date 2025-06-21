import axios from 'axios';
import FormData from 'form-data';
import { Router, Request, Response } from "express";
import multer from "multer";

const RoutesIA = Router();
const IA_URL = process.env.IA_URL || "http://localhost:8000";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.'));
  }
});

RoutesIA.post("/ia-cololhama/processamento", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Nenhum arquivo foi enviado" });
      return;
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${IA_URL}/processamento-cor-cabelo`, formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Erro no microserviço:", error.response?.status, error.response?.data);
    res.status(error.response?.status || 500).json({
      error: "Erro ao processar imagem",
      details: error.response?.data || error.message
    });
  }
});

export default RoutesIA;
