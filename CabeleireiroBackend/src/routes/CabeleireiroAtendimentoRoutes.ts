import express from "express";
import AtendimentoController from "../controllers/CabeleireiroAtendimentoController";

const router = express.Router();

router.get("/atendimento/page", AtendimentoController.getAtendimentosPage);
router.get("/atendimento/ID/:id", AtendimentoController.findById);
router.post("/atendimento", AtendimentoController.createAtendimento);
router.put("/atendimento", AtendimentoController.updateAtendimento);
router.delete(
  "/atendimento/delete/:id",
  AtendimentoController.deleteAtendimento
);

export default router;
