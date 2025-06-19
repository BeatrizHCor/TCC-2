import { Request, Response } from "express";
import  PortfolioService  from "../services/PortfolioService";


export class PortfolioController {
  static async createPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const { CabeleireiroId, Descricao, SalaoId } = req.body;
      if (!CabeleireiroId || !Descricao || !SalaoId) {
        res.status(400).json({ error: "CabeleireiroId, Descricao e SalaoId são obrigatórios." });
        return;
      }
      const portfolio = await PortfolioService.createPortfolio(CabeleireiroId, SalaoId, Descricao);
      res.status(201).json(portfolio);
    } catch (error) {
      console.error("Erro ao criar portfolio:", error);
      res.status(500).json({ error: "Erro interno ao criar portfolio." });
    }
  }

  static async getPortfolioById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const portfolio = await PortfolioService.getPortfolioById(id);
      if (!portfolio) {
        res.status(404).json({ error: "Portfolio não encontrado." });
        return;
      }
      res.status(200).json(portfolio);
    } catch (error) {
      console.error("Erro ao buscar portfolio por ID:", error);
      res.status(500).json({ error: "Erro interno ao buscar portfolio." });
    }
  }
  static async getAllPortfolios(req: Request, res: Response): Promise<void> {
    try {
      const { skip, take, salaoId } = req.query;
      const portfolios = await PortfolioService.getAllPortfolios(
          Number(skip) || 0,
          Number(take) || 10,
          salaoId ? String(salaoId) : null
      );
      res.status(200).json(portfolios);
      } catch (error) {
      console.error("Erro ao buscar portfolios:", error);
      res.status(500).json({ error: "Erro interno ao buscar portfolios." });
      }
    }
  static async getPortfolioByCabeleireiro(req: Request, res: Response): Promise<void> {
    try {
        const { cabeleireiroId } = req.params;
        if (!cabeleireiroId) {
            res.status(400).json({ error: "CabeleireiroId é obrigatório." });
            return;
        }console.log("controller recebido: ", cabeleireiroId)
        const portfolios = await PortfolioService.getPortfolioByCabeleireiroId(cabeleireiroId);
        if (portfolios){
        res.status(200).json(portfolios);
        } else {
          res.status(204).json({ message: "Portfolio não encontrado."})
        }
    } catch (error) {
        console.error("Erro ao buscar portfolios por cabeleireiro:", error);
        res.status(500).json({ error: "Erro interno ao buscar portfolios." });
        }
    }
  static async deletePortfolio(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedPortfolio = await PortfolioService.deletePortfolio(id);
      if (!deletedPortfolio) {
        res.status(404).json({ error: "Portfolio não encontrado." });
        return;
      }
      res.status(200).json({ message: "Portfolio deletado com sucesso." });
    } catch (error) {
      console.error("Erro ao deletar portfolio:", error);
      res.status(500).json({ error: "Erro interno ao deletar portfolio." });
    }
  }
}
export default PortfolioController;