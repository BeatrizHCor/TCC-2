import express from "express";
import { PortfolioController } from "../controllers/PortfolioController";

const router = express.Router();

router.post("/portfolio", PortfolioController.createPortfolio);
router.get("/portfolio/ID/:id", PortfolioController.getPortfolioById);
router.get("/portfolio/:CabeleireiroId", PortfolioController.getPortfolioByCabeleireiro);
router.get("/portfolio/all", PortfolioController.getAllPortfolios);
router.delete("/portfolio/delete/:id", PortfolioController.deletePortfolio);
export default router;
