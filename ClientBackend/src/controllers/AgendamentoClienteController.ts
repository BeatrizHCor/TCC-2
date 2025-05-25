import { Request, Response } from "express";
import clienteAgendamentoService from "../services/AgendamentoClienteService";

class ClienteControllerService {
    static create = async (req: Request, res: Response) => {
      try { 
          const { Data, ClienteID, SalaoId, CabeleireiroID} = req.body;
          const agendamento = await clienteAgendamentoService.createAgendamento(
              Data,
              "Agendado",
              ClienteID,
              SalaoId,
              CabeleireiroID
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
  
    static findAllPaginated = async (req: Request, res: Response) => {
      try {
        const { page, limit, salaoId, clienteId, dia, mes, ano } = req.query;
        const agendamentos = await clienteAgendamentoService.getAgendamentosPage(
          Number(page),
          Number(limit),
          salaoId ? String(salaoId) : null,
          clienteId ? String(clienteId) : null,
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


}

export default ClienteControllerService;