import express from "express";
import { ImagemController } from "../controllers/ImagemController";
import { upload } from "../middleware/multer";

const router = express.Router();

router.post("/imagem/portfolio", upload.single("imagem"), ImagemController.uploadImagePortfolio);
router.get("/imagem/ID/:id", ImagemController.getById);
router.delete("/imagem/:portfolioId/:imagemId", ImagemController.deleteImagem);
router.put("/imagem/:portfolioId/:imagemId", ImagemController.updateImagem);

export default router;
