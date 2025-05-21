import { Prisma, StatusAgendamento, Agendamentos } from "@prisma/client";
import prisma from "../config/database";

class clienteAgendamentoService{
    
    static createAgendamento = async(
        Data: Date,
        Status: StatusAgendamento = "Agendado",
        ClienteID: string,
        SalaoId: string,
        CabeleireiroID: string,
    ) => {
      try{
        return await prisma.agendamentos.create({
            data: {
                Data: Data,
                Status: Status,
                ClienteID: ClienteID,
                SalaoId: SalaoId,
                CabeleireiroID: CabeleireiroID,                
            },
        });  
        } catch(e){
          console.log(e);
          return null;
        }
    }

}

export default clienteAgendamentoService;