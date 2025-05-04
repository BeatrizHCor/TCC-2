import express from "express";
import multer from "multer";
import path from "path";
import { ImagemController } from "../controllers/ImagemController";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/portfolio", upload.single("imagem"), ImagemController.uploadPortfolio);
router.get("/imagem/:id", ImagemController.getById);
router.get("/portfolio/:portfolioId/imagens", ImagemController.getByPortfolio);

export default router;
