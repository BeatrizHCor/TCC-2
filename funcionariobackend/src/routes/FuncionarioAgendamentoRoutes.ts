import express from "express";
import AgendamentoController from "../controllers/FuncionarioAgendamentoController";

const router = express.Router();

router.get("/agendamento/page", AgendamentoController.findAllPaginated);
router.get("/agendamento/ID/:id", AgendamentoController.findById);
router.post("/agendamento", AgendamentoController.createAgendamento);

export default router;