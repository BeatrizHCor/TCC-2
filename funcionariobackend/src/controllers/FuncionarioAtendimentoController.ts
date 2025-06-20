import { Request, Response } from "express";
import AtendimentoService from "../services/FuncionarioAtendimentoService";
import AgendamentoService from "../services/FuncionarioAgendamentoService";

class AtendimentoController {
  static async getAtendimentosPage(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        includeRelations,
        SalaoId = null,
        cliente = null,
        cabeleireiro = null,
        data = null,
      } = req.query;

      const Atendimentos = await AtendimentoService.getAtendimentosPage(
        Number(page),
        Number(limit),
        includeRelations === "true",
        SalaoId ? String(SalaoId) : null,
        cliente ? String(cliente) : null,
        cabeleireiro ? String(cabeleireiro) : null,
        data ? String(data) : null
      );
      res.json(Atendimentos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar atendimentos" });
    }
  }

  static async createAtendimento(req: Request, res: Response) {
    try {
      const {
        Data,
        PrecoTotal,
        Auxiliar,
        SalaoId,
        servicosAtendimento = [],
        auxiliares = [],
        AgendamentoID,
      } = req.body;
      const atendimento = await AtendimentoService.createAtendimento(
        Data,
        PrecoTotal,
        Auxiliar,
        SalaoId,
        servicosAtendimento,
        auxiliares
      );

      if (AgendamentoID && atendimento && atendimento.ID) {
        await AgendamentoService.updateAdicionarAtendimento(
          AgendamentoID,
          atendimento.ID
        );
      }

      res.status(201).json(atendimento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar atendimento" });
    }
  }

  static async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const includeRelations = req.query.includeRelations === "true";
      const atendimento = await AtendimentoService.findById(
        id,
        includeRelations
      );
      if (!atendimento) {
        res.status(204).json({ message: "Atendimento não encontrado" });
        return;
      }
      res.json(atendimento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar atendimento" });
    }
  }

  static async updateAtendimento(req: Request, res: Response) {
    try {
      const { atendimentoId } = req.params;
      const {
        Data,
        PrecoTotal,
        Auxiliar,
        SalaoId,
        servicosAtendimento = [],
        auxiliares = [],
      } = req.body;
      console.log(req.params);
      const atendimento = await AtendimentoService.updateAtendimento(
        atendimentoId,
        Data,
        PrecoTotal,
        Auxiliar,
        SalaoId,
        servicosAtendimento,
        auxiliares
      );
      res.json(atendimento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar atendimento" });
    }
  }

  static async deleteAtendimento(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await AtendimentoService.deleteAtendimento(id);
      res.json(deleted);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao deletar atendimento" });
    }
  }

  static async findByAgendamento(req: Request, res: Response) {
    try {
      const { agendamentoId } = req.params;
      const atendimento = await AtendimentoService.findByAgendamento(
        agendamentoId
      );
      res.json(atendimento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao deletar atendimento" });
    }
  }
}

export default AtendimentoController;
