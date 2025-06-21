import { Request, Response } from "express";
import AtendimentoService from "../services/ClienteAtendimentoService";

class AtendimentoController {
  static async getAtendimentosPage(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        includeRelations,
        SalaoId = null,
        cabeleireiro = null,
        userId,
        data = null,
      } = req.query;
      console.log(req.query);
      const Atendimentos = await AtendimentoService.getAtendimentosPage(
        Number(page),
        Number(limit),
        includeRelations === "true",
        SalaoId ? String(SalaoId) : null,
        cabeleireiro ? String(cabeleireiro) : null,
        String(userId),
        data ? String(data) : null
      );
      console.log("Atendimentos controller:", Atendimentos);
      res.json(Atendimentos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar atendimentos" });
    }
  }
}

export default AtendimentoController;
