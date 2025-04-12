import express from "express";
import CabeleireiroController from "../controllers/CabeleireiroController";

const router = express.Router();

router.get("/cabeleireiro/page", CabeleireiroController.findAllPaginated);
router.get("/cabeleireiro/ID/:id/", CabeleireiroController.findById);
router.post("cabeleireiro", CabeleireiroController.create);
export default router;
