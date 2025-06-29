import { Request, Response } from "express";
import AtendimentoService from "../services/ClienteAtendimentoService";

class AtendimentoController {
  static async getAtendimentosPage(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        includeRelations,
        salaoId = null,
        data = null,
        userId,
        cabeleireiro = null
      } = req.query;
      const Atendimentos = await AtendimentoService.getAtendimentosPage(
        Number(page),
        Number(limit),
        includeRelations === "true",
        salaoId ? String(salaoId) : null,
        cabeleireiro ? String(cabeleireiro) : null,
        String(userId),
        data ? String(data) : null
      );
      res.json(Atendimentos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar atendimentos" });
    }
  }
}

export default AtendimentoController;
