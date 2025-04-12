import express from "express";
import CabeleireiroController from "../controllers/CabeleireiroController";

const router = express.Router();

router.get("/cabeleireiro/page", CabeleireiroController.findAllPaginated);
router.get("/cabeleireiro/all");
router.get("/cabeleireiro/ID/:id/");

export default router;
