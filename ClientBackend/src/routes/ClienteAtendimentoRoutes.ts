import express from "express";
import AtendimentoController from "../controllers/ClienteAtendimentoController";

const router = express.Router();

router.get("/atendimento/page", AtendimentoController.getAtendimentosPage);

export default router;
