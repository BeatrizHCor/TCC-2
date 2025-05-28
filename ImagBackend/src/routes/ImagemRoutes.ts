import express from "express";
import multer from "multer";
import path from "path";
import { ImagemController } from "../controllers/ImagemController";
import { upload } from "../middleware/multer";

const router = express.Router();

router.post("/imagem/portfolio", upload.single("imagem"), ImagemController.uploadImagePortfolio);
router.get("/imagem/ID/:id", ImagemController.getById);
router.get("/imagem/:portfolioId", ImagemController.getByPortfolio);
router.delete("/imagem/:portfolioId/:imagemId", ImagemController.deleteImagembyPortfolio);

export default router;
