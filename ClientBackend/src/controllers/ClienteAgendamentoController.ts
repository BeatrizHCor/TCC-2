import { Request, Response } from "express";
import AgendamentoService from "../services/ClienteAgendamentoService";

class AgendamentoController {
  static findAllPaginated = async (req: Request, res: Response) => {
    try {
      const {
        page,
        limit,
        includeRelations,
        salaoId,
        ClienteId,
        dia,
        mes,
        ano,
      } = req.query;
      if (!ClienteId) {
        res.status(403).json({
          message: "Acesso não autorizado. Controller. findAllPaginated",
        });
      } else {
        const agendamentos = await AgendamentoService.getAgendamentosPage(
          Number(page),
          Number(limit),
          includeRelations === "true",
          salaoId ? String(salaoId) : null,
          ClienteId ? String(ClienteId) : "",
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
      const includeRelations = req.query.include === "true";
      const cabeleireiro = await AgendamentoService.findById(
        id,
        includeRelations,
      );
      if (!cabeleireiro) {
        res
          .status(204)
          .json({ message: "Agendamentos não encontrado" });
      } else {
        res.json(cabeleireiro);
      }
    } catch (e) {
      console.log(e);
      res.status(204).json({ message: "Agendamentos não encontrado" });
    }
  };
  static createAgendamento = async (req: Request, res: Response) => {
    try {
      const { Data, ClienteID, SalaoId, CabeleireiroID, Servicos } = req.body;
      const agendamento = await AgendamentoService.createAgendamento(
        new Date(Data),
        "Agendado",
        ClienteID,
        SalaoId,
        CabeleireiroID,
        Servicos,
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
      res
        .status(500)
        .json({ message: "Não foi possivél criar o agendamento" });
    }
  };

  static updateAgendamento = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { Data, Status, ClienteID, SalaoId, CabeleireiroID, Servicos } =
        req.body;
      const agendamento = await AgendamentoService.updateAgendamento(
        id,
        new Date(Data),
        Status,
        ClienteID,
        SalaoId,
        CabeleireiroID,
        Servicos,
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

  static getHorariosOcupadosFuturos = async (req: Request, res: Response): Promise<void> => {
    try {
      const { salaoId, cabeleireiroId } = req.params;
      const { data } = req.query;

      if (!salaoId || !cabeleireiroId || !data) {
        res.status(400).json({
          message: "Parâmetros obrigatórios: salaoId, cabeleireiroId e data.",
        });
      } else {
        const dataInicial = new Date(String(data));
        if (isNaN(dataInicial.getTime())) {
          res.status(400).json({ message: "Data inválida." });
        } else {
          const horarios = await AgendamentoService.getHorariosOcupadosFuturos(
            salaoId,
            cabeleireiroId,
            dataInicial,
          );
          res.status(200).json(horarios);
        }
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Erro ao buscar horários ocupados futuros.",
      });
    }
  };
}

export default AgendamentoController;
