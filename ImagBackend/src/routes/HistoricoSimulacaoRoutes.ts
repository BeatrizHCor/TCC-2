import express from "express";
import multer from "multer";
import path from "path";
import { HistoricoSimulacaoController } from "../controllers/HistoricoSimulacaoController";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/simulacoes/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // limite de 100MB
    }
});


//router.post("/historico-simulacao", upload.single('imagem'), HistoricoSimulacaoController.createHistoricoSimulacao);
router.get("/historico-simulacao/ID/:id", HistoricoSimulacaoController.getHistoricoSimulacaoById);
router.get("/historico-simulacao/cliente/:clienteId", HistoricoSimulacaoController.getHistoricoSimulacaoByCliente);
router.get("/historico-simulacao/all", HistoricoSimulacaoController.getAllHistoricoSimulacao);
router.put("/historico-simulacao/update/:id", HistoricoSimulacaoController.updateHistoricoSimulacao);
router.delete("/historico-simulacao/delete/:id", HistoricoSimulacaoController.deleteHistoricoSimulacao);


router.post("/historico-simulacao", HistoricoSimulacaoController.salvarSimulacaoJson);
router.get("/historico/cliente/:clienteId", HistoricoSimulacaoController.getHistoricoSimulacaoByCliente);


export default router;