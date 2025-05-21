import { Request, Response } from "express";
import AgendamentoService from "../services/AgendamentoService";

class AgendamentoController{
  static findAllPaginated = async (req: Request, res: Response) => {
    try {
      const { page, limit, includeRelations, salaoId, dia, mes, ano } = req.query;
      const agendamentos = await AgendamentoService.getAgendamentosPage(
        Number(page),
        Number(limit),
        includeRelations === "true",
        salaoId ? String(salaoId) : null,
        dia !== undefined ? Number(dia) : 0,
        mes !== undefined ? Number(mes) : 0,
        ano !== undefined ? Number(ano) : 0,
      );
      res.status(200).json(agendamentos);
    } catch (error) {
      console.log(error);
      res.status(204).json({ message: "Agendamentos não encontrado" });
    }
  };

  static findById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const includeRelations = req.query.include === "true"; // Converte include para booleano
      const cabeleireiro = await AgendamentoService.findById(
        id,
        includeRelations
      );
      if (!cabeleireiro) {
        res.status(204).json({ message: "Agendamentos não encontrado" });
      } else {
        res.json(cabeleireiro);
      }
    } catch (e) {
      console.log(e);
      res.status(204).json({ message: "Agendamentos não encontrado" });
    }
  }; 



}

export default AgendamentoController;