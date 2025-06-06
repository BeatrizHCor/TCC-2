import express from "express";
import AgendamentoController from "../controllers/CabeleireiroAgendamentoController";

const router = express.Router();

router.get("/agendamento/page", AgendamentoController.findAllPaginated);
router.get("/agendamento/ID/:id", AgendamentoController.findById);
router.post("/agendamento", AgendamentoController.createAgendamento);
router.put("/agendamento", AgendamentoController.updateAgendamento);
router.delete("/agendamento/delete/:id", AgendamentoController.deleteAgendamento);

export default router;