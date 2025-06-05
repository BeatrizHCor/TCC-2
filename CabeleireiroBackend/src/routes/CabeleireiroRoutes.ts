import express from "express";
import CabeleireiroController from "../controllers/CabeleireiroController";

const router = express.Router();

router.get("/cabeleireiro/page", CabeleireiroController.findAllPaginated);
// router.get("/cabeleireiro/salao/:id", CabeleireiroController.getBySalao);
router.get("/cabeleireiro/ID/:id", CabeleireiroController.findById);
router.post("/cabeleireiro", CabeleireiroController.create);
router.put("/cabeleireiro", CabeleireiroController.update);
router.delete("/cabeleireiro/delete/:id", CabeleireiroController.delete);
export default router;
