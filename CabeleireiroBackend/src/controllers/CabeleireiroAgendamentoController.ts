import { Request, Response } from "express";
import AgendamentoService from "../services/CabeleireiroAgendamentoService";
import { toZonedTime } from "date-fns-tz";

class AgendamentoController {
  static findAllPaginated = async (req: Request, res: Response) => {
    try {
      const {
        page,
        limit,
        includeRelations,
        salaoId,
        CabeleireiroId,
        dia,
        mes,
        ano,
      } = req.query;
      if (!CabeleireiroId) {
        res.status(403).json({
          message: "Acesso não autorizado. Controller. findAllPaginated",
        });
      } else {
        const agendamentos = await AgendamentoService.getAgendamentosPage(
          !isNaN(Number(page)) ? Number(page) : null,
          !isNaN(Number(limit)) ? Number(limit) : null,
          includeRelations === "true",
          salaoId ? String(salaoId) : null,
          CabeleireiroId ? String(CabeleireiroId) : "",
          dia !== undefined ? Number(dia) : 0,
          mes !== undefined ? Number(mes) : 0,
          ano !== undefined ? Number(ano) : 0,
        );
        res.status(200).json(agendamentos);
      }
    } catch (error) {
      console.log(error);
      res.status(204).json({ message: "Agendamentos não encontrado" });
    }
  };

  static findById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const includeRelations = req.query.includeRelations === "true";
      const agendamento = await AgendamentoService.findById(
        id,
        includeRelations,
      );
      if (!agendamento) {
        res
          .status(204)
          .json({ message: "Agendamentos não encontrado" });
      } else {
        res.json(agendamento);
      }
    } catch (e) {
      console.log(e);
      res.status(204).json({ message: "Agendamentos não encontrado" });
    }
  };

  static createAgendamento = async (req: Request, res: Response) => {
    try {
      const { Data, ClienteID, SalaoId, CabeleireiroID, servicosIds } =
        req.body;
      let timezone = "America/Sao_Paulo";
      const data = new Date(Data);
      const dataBrasilia = toZonedTime(data, timezone);
      const agendamento = await AgendamentoService.createAgendamento(
        dataBrasilia,
        "Agendado",
        ClienteID,
        SalaoId,
        CabeleireiroID,
        servicosIds,
      );
      if (!agendamento || agendamento === null) {
        res
          .status(404)
          .json({ message: "agendamento não pode ser registrado" });
      } else {
        res.json(agendamento);
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Não foi possivél criar o agendamento" });
    }
  };

  static updateAgendamento = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { Data, Status, ClienteID, SalaoId, CabeleireiroID, servicosIds } =
        req.body;
      const agendamento = await AgendamentoService.updateAgendamento(
        id,
        new Date(Data),
        Status,
        ClienteID,
        SalaoId,
        CabeleireiroID,
        servicosIds,
      );
      if (!agendamento) {
        res.status(404).json({ message: "Agendamento não encontrado" });
      } else {
        res.json(agendamento);
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Erro ao atualizar o agendamento" });
    }
  };

  static deleteAgendamento = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const agendamento = await AgendamentoService.deleteAgendamento(id);
      if (!agendamento) {
        res.status(404).json({ message: "Agendamento não encontrado" });
      } else {
        res.json({ message: "Agendamento deletado com sucesso" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Erro ao deletar o agendamento" });
    }
  };
}
export default AgendamentoController;
