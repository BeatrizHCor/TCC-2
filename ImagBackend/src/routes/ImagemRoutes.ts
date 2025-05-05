import express from "express";
import multer from "multer";
import path from "path";
import { ImagemController } from "../controllers/ImagemController";
import { upload } from "../middleware/multer";

const router = express.Router();

router.post("/portfolio", upload.single("imagem"), ImagemController.uploadPortfolio);
router.get("/imagem/ID/:id", ImagemController.getById);
router.get("/portfolio/:portfolioId", ImagemController.getByPortfolio);

export default router;
