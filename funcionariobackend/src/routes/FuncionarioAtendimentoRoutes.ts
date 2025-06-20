import express from "express";
import AtendimentoController from "../controllers/FuncionarioAtendimentoController";

const router = express.Router();

router.get("/atendimento/page", AtendimentoController.getAtendimentosPage);
router.get("/atendimento/ID/:id", AtendimentoController.findById);
router.get(
  "/atendimentobyagendamento/:agendamentoId",
  AtendimentoController.findByAgendamento
);
router.post("/atendimento", AtendimentoController.createAtendimento);
router.delete(
  "/atendimento/delete/:id",
  AtendimentoController.deleteAtendimento
);
router.put(
  "/atendimento/:atendimentoId",
  AtendimentoController.updateAtendimento
);

export default router;
