import { Prisma, StatusAgendamento, Agendamentos } from "@prisma/client";
import prisma from "../config/database";

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
        if (salaoId !== null) {
        whereCondition.SalaoId = salaoId;
        }

        if (dia !== 0 && !Number.isNaN(dia) && mes !== 0 && !Number.isNaN(mes) && ano !== 0 && !Number.isNaN(ano)) {
        const dataInicial = new Date(Date.UTC(ano, mes - 1, dia, 0, 0, 0));
        const dataFinal = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59));
          //chamada de todas em um dia expecifico
        whereCondition.Data = {
            gte: dataInicial,
            lte: dataFinal,
        };
        } else if (ano !== 0 && !Number.isNaN(ano) && mes !== 0 && !Number.isNaN(mes)) {
        const dataInicio = new Date(Date.UTC(ano, mes - 1, 1, 0, 0, 0));
        const dataFim = new Date(Date.UTC(ano, mes, 0, 23, 59, 59)); 
          //chamada de todas em um mes expecifico 
        whereCondition.Data = {
            gte: dataInicio,
            lte: dataFim,
        };
        } else if (ano !== 0 && !Number.isNaN(ano)) {
        const dataInicio = new Date(Date.UTC(ano, 0, 1, 0, 0, 0));   
        const dataFim = new Date(Date.UTC(ano, 11, 31, 23, 59, 59));  
          //chama de todas em um ano 
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