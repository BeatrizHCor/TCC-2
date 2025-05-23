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
        } catch (error) {
        throw new Error("Erro ao criar Agendamento");
        }
    }

        static getAgendamentos = async (
        skip: number | null = null,
        limit: number | null = null,
        include = false,
        salaoId: string | null = null,
        clienteId: string | null = null,
        dia: number = 0,
        mes: number = 0,
        ano: number = 0
    ) => {
        let whereCondition: Prisma.AgendamentosWhereInput = {};
        console.log("Valores d,m,a: ",dia,mes,ano)
            whereCondition.Status = "Agendado";
        if (salaoId !== null) {
            whereCondition.SalaoId = salaoId;
        }
        if (clienteId !== null) {
            whereCondition.ClienteID = clienteId;
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
        salaoId: string | null = null,
        clienteId: string | null = null,
        dia: number,
        mes: number,
        ano: number
    ) => {
        const skip = (page - 1) * limit;

        const [total, agendamentos, agendamentosCliente] = await Promise.all([
        clienteAgendamentoService.getAgendamentos(null, null, false, salaoId, null, dia, mes, ano),
        clienteAgendamentoService.getAgendamentos(
            skip,
            limit,
            false,
            salaoId,
            null,
            dia,
            mes,
            ano
        ),
        clienteAgendamentoService.getAgendamentos(
            skip,
            limit,
            true,
            salaoId,
            clienteId,
            dia,
            mes,
            ano
        ),
        ]);

        return {
        total: total,
        page,
        limit,
        horariosIndisponiveis: agendamentos.map(a => a.Data),
        clinteData: agendamentosCliente        
        };
    };

}

export default clienteAgendamentoService;