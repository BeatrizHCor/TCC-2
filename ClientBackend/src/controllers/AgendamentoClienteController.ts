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

}

export default ClienteControllerService;