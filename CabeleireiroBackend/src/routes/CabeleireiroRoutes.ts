import express from "express";
import CabeleireiroController from "../controllers/CabeleireiroController";

const router = express.Router();

router.get("/cabeleireiro/page", CabeleireiroController.findAllPaginated);
router.get("/cabeleireiro/ID/:id/", CabeleireiroController.findById);
router.post("/cabeleireiro", CabeleireiroController.create);
router.put("/cabeleireiro", CabeleireiroController.update);
router.delete("/cabeleireiro/ID/:id", CabeleireiroController.delete);
export default router;
