import { Prisma, StatusAgendamento, Agendamentos } from "@prisma/client";
import prisma from "../config/database";

class AgendamentoService{

    static getAgendamentos = async (
        skip: number | null = null,
        limit: number | null = null,
        include = false,
        salaoId: string | null = null,
        dia: number,
        mes: number,
        ano: number
    ) => {
        let whereCondition: Prisma.AgendamentosWhereInput = {};

        if (salaoId) {
        whereCondition.SalaoId = salaoId;
        }

        if (dia !== 0 && mes !== 0 && ano !== 0) {
        const dataInicial = new Date(ano, mes - 1, dia, 0, 0, 0);
        const dataFinal = new Date(ano, mes - 1, dia, 23, 59, 59);

        whereCondition.Data = {
            gte: dataInicial,
            lte: dataFinal,
        };
        } else if (ano !== 0 && mes !== 0) {
        const dataInicio = new Date(ano, mes - 1, 1, 0, 0, 0);
        const dataFim = new Date(ano, mes, 0, 23, 59, 59); //  dia 0 do mês seguinte = último dia do mês atual

        whereCondition.Data = {
            gte: dataInicio,
            lte: dataFim,
        };
        } else if (ano !== 0) {
        const dataInicio = new Date(ano, 0, 1, 0, 0, 0);   
        const dataFim = new Date(ano, 11, 31, 23, 59, 59);  

        whereCondition.Data = {
            gte: dataInicio,
            lte: dataFim,
        };
        }
        return await prisma.agendamentos.findMany({
        ...(skip !== null ? { skip } : {}),
        ...(limit !== null ? { take: limit } : {}),
        where: whereCondition,
        ...(include
            ? {
                include: {
                Cliente: true,
                Cabeleireiro: true,
                Atendimento: true,
                },
            }
            : {}),
        });
    };

    static getAgendamentosPage = async (
        page = 1,
        limit = 10,
        includeRelations = false,
        salaoId: string | null = null,
        dia: number,
        mes: number,
        ano: number
    ) => {
        const skip = (page - 1) * limit;

        const [total, agendamentos] = await Promise.all([
        AgendamentoService.getAgendamentos(null, null, false, salaoId, dia, mes, ano),
        AgendamentoService.getAgendamentos(
            skip,
            limit,
            includeRelations,
            salaoId,
            dia,
            mes,
            ano
        ),
        ]);

        return {
        total: total.length,
        page,
        limit,
        data: agendamentos,
        };
    };

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

      static findById = async (ID: string, include = false) => {
    try {
      return await prisma.agendamentos.findUnique({
        where: {
          ID: ID,
        },
        ...(include
            ? {
                include: {
                Cliente: true,
                Cabeleireiro: true,
                Atendimento: true,
                },
            }
            : {}),
      });
    } catch (e) {
      console.log(e);
      return false;
    }
  };

}

export default AgendamentoService;