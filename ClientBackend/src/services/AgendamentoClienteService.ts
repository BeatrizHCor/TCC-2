import { Prisma, StatusAgendamento, Agendamentos } from "@prisma/client";
import prisma from "../config/database";
import { getRangeByDataInputWithTimezone } from "../utils/CalculoPeriododeTempo";

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
        const range = getRangeByDataInputWithTimezone(ano,mes,dia);
        console.log(range);
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
        clienteData: agendamentosCliente        
        };
    };

}

export default clienteAgendamentoService;