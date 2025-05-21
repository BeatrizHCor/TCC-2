import express from "express";
import ClienteControllerService from "../controllers/AgendamentoClienteController";

const router = express.Router();

router.post("/agendamento", ClienteControllerService.create);

export default router;