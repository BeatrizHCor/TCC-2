import { Prisma, StatusAgendamento, Agendamentos } from "@prisma/client";
import prisma from "../config/database";
import { getRangeByDataInputWithTimezone } from "../utils/CalculoPeriododeTempo";

class AgendamentoService{

    static getAgendamentos = async (
        skip: number | null = null,
        limit: number | null = null,
        include = false,
        salaoId: string | null = null,
        dia: number = 0,
        mes: number = 0,
        ano: number = 0
    ) => {
        let whereCondition: Prisma.AgendamentosWhereInput = {};
        console.log("Valores d,m,a: ",dia,mes,ano)
        const range = getRangeByDataInputWithTimezone("2025");
        if (salaoId !== null) {
        whereCondition.SalaoId = salaoId;
        }
        if (range !== null) {
            whereCondition.Data = {
            gte: range.dataInicial,
            lte: range.dataFinal,
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

        let where: Prisma.AgendamentosWhereInput = {};
        const range = getRangeByDataInputWithTimezone("2025");
        if (salaoId !== null) {
            where.SalaoId = salaoId;
        }
        if (range !== null) {
            where.Data = {
                gte: range.dataInicial,
                lte: range.dataFinal,
            };
        }
        
        const [total, agendamentos] = await Promise.all([
            prisma.agendamentos.count({ where: where }),
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
        total: total,
        page,
        limit,
        data: agendamentos,
        };
    };

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

export default AgendamentoService;