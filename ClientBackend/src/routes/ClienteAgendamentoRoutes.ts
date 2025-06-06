import express from "express";
import ClienteControllerService from "../controllers/ClienteAgendamentoController";

const router = express.Router();

router.post("/agendamento", ClienteControllerService.createAgendamento);
router.get("/agendamento/page", ClienteControllerService.findAllPaginated);
router.get("/agendamento/ID/:id",)


export default router;