import express from "express";
import ClienteController from "../controllers/clienteController";


const router = express.Router();

router.get("/cliente/page", ClienteController.getClientesPage);
router.get("/cliente/all", ClienteController.findAll);
router.get("/cliente/ID/:id/", ClienteController.findByID);
router.get(
  "/cliente/email/:email/:salaoId",
  ClienteController.findByEmailandSalao
);
router.get("/cliente/cpf/:cpf/:salaoId", ClienteController.findByCpfandSalao);
router.post("/cliente", ClienteController.create);
router.put("/cliente/:id", ClienteController.update);
router.delete("/cliente/delete/:id", ClienteController.delete);
router.get("/cliente/salaoId/:salaoId", ClienteController.getClientesBySalao);


export default router;