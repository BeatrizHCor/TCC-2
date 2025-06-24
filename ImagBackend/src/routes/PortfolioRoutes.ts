import express from "express";
import { PortfolioController } from "../controllers/PortfolioController";

const router = express.Router();

router.post("/portfolio", PortfolioController.createPortfolio);
router.get("/portfolio/ID/:id", PortfolioController.getPortfolioById);
router.get("/portfolio/info/:id", PortfolioController.getPortfolioInfoById);
router.get("/portfolio/:cabeleireiroId", PortfolioController.getPortfolioByCabeleireiro);
router.get("/portfolio/all", PortfolioController.getAllPortfolios);
router.put("/portfolio/:id", PortfolioController.upadatePortfolioDescricaoById);
router.delete("/portfolio/delete/:id", PortfolioController.deletePortfolio);
export default router;
