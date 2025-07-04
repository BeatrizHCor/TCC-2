import express from "express";
import AgendamentoController from "../controllers/ClienteAgendamentoController";

const router = express.Router();

router.get("/agendamento/page", AgendamentoController.findAllPaginated);
router.get("/agendamento/ID/:id", AgendamentoController.findById);
router.post("/agendamento", AgendamentoController.createAgendamento);
router.put("/agendamento/:id", AgendamentoController.updateAgendamento);
router.delete("/agendamento/delete/:id", AgendamentoController.deleteAgendamento);
router.get("/agendamento/horarios/:salaoId/:cabeleireiroId", AgendamentoController.getHorariosOcupadosFuturos);

export default router;