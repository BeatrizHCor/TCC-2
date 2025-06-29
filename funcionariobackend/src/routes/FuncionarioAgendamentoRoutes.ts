import express from "express";
import AgendamentoController from "../controllers/FuncionarioAgendamentoController";

const router = express.Router();

router.get("/agendamento/page", AgendamentoController.findAllPaginated);
router.get("/agendamento/ID/:id", AgendamentoController.findById);
router.post("/agendamento", AgendamentoController.createAgendamento);
router.put("/agendamento/:id", AgendamentoController.updateAgendamento);
router.delete(
  "/agendamento/delete/:id",
  AgendamentoController.deleteAgendamento
);

export default router;
