import {
  Prisma,
  StatusAgendamento,
  Agendamentos,
  Servico,
  ServicoAgendamento,
} from "@prisma/client";
import prisma from "../config/database";
import { getRangeByDataInputWithTimezone } from "../utils/CalculoPeriododeTempo";

class AgendamentoService {
  static getAgendamentos = async (
    skip: number | null = null,
    limit: number | null = null,
    include = false,
    salaoId: string | null = null,
    cabeleireiroId: string,
    dia: number = 0,
    mes: number = 0,
    ano: number = 0
  ) => {
    let where: Prisma.AgendamentosWhereInput = {};
    const range = getRangeByDataInputWithTimezone(ano, mes, dia);
    if (salaoId !== null) {
      where.SalaoId = salaoId;
    }
    if (range !== null) {
      where.Data = {
        gte: range.dataInicial,
        lte: range.dataFinal,
      };
    }
    if (cabeleireiroId!) {
      where.CabeleireiroID = cabeleireiroId;
    }
    return await prisma.agendamentos.findMany({
      ...(skip !== null ? { skip } : {}),
      ...(limit !== null ? { take: limit } : {}),
      where: where,
      ...(include
        ? {
            include: {
              Cliente: true,
              Cabeleireiro: true,
              Atendimento: true,
            },
          }
        : {}),
      orderBy: {
        Data: "asc",
      },
    });
  };

  static getAgendamentosPage = async (
    page: number | null,
    limit: number | null,
    includeRelations: boolean,
    salaoId: string | null = null,
    cabeleireiroId: string,
    dia: number,
    mes: number,
    ano: number
  ) => {
    try {
      let skip = null;
      if (page !== null && limit !== null) {
        skip = (page - 1) * limit;
      }

      let where: Prisma.AgendamentosWhereInput = {};
      const range = getRangeByDataInputWithTimezone(ano, mes, dia);
      if (salaoId !== null) {
        where.SalaoId = salaoId;
      }
      if (range !== null) {
        where.Data = {
          gte: range.dataInicial,
          lte: range.dataFinal,
        };
      }

      where.CabeleireiroID = cabeleireiroId;

      const [total, agendamentos] = await Promise.all([
        prisma.agendamentos.count({ where: where }),
        AgendamentoService.getAgendamentos(
          skip,
          limit,
          includeRelations,
          salaoId,
          cabeleireiroId,
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
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao buscar agendamento");
    }
  };

  static findByAtendimentoId = async (atendimentoId: string) => {
    try {
      return await prisma.agendamentos.findFirst({
        where: {
          AtendimentoID: atendimentoId,
        },
        include: {
          ServicoAgendamento: true,
        },
      });
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao buscar agendamento");
    }
  };

  static updateAgendamentoStatus = async (
    id: string,
    Status: StatusAgendamento
  ) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const agendamento = await tx.agendamentos.update({
          where: { ID: id },
          data: {
            Status,
          },
        });
        return agendamento;
      });
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao atualizar agendamento");
    }
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
                ServicoAgendamento: true,
              },
            }
          : {}),
      });
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao buscar agendamento");
    }
  };

  static createAgendamento = async (
    Data: Date,
    Status: StatusAgendamento = "Agendado",
    ClienteID: string,
    SalaoId: string,
    CabeleireiroID: string,
    servicos: string[] = []
  ) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const servicosSelecionados = await tx.servico.findMany({
          where: {
            ID: { in: servicos },
            SalaoId: SalaoId,
          },
        });
        const agendamento = await tx.agendamentos.create({
          data: {
            Data,
            Status,
            ClienteID,
            SalaoId,
            CabeleireiroID,
          },
        });
        if (servicosSelecionados.length > 0) {
          await tx.servicoAgendamento.createMany({
            data: servicosSelecionados.map((servico) => ({
              AgendamentosId: agendamento.ID,
              ServicoId: servico.ID,
              Nome: servico.Nome,
              PrecoMin: servico.PrecoMin,
              PrecoMax: servico.PrecoMax,
            })),
          });
        }
        return agendamento;
      });
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao criar agendamento.");
    }
  };

  static updateAgendamento = async (
    id: string,
    Data: Date,
    Status: StatusAgendamento,
    ClienteID: string,
    SalaoId: string,
    CabeleireiroID: string,
    Servicos: string[] = []
  ) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const agendamento = await tx.agendamentos.update({
          where: {
            ID: id,
            CabeleireiroID: CabeleireiroID,
          },
          data: {
            Data: Data,
            Status: Status,
            ClienteID: ClienteID,
            SalaoId: SalaoId,
            CabeleireiroID: CabeleireiroID,
          },
        });
        await tx.servicoAgendamento.deleteMany({
          where: { AgendamentosId: id },
        });
        let services: Servico[] = [];
        if (Servicos.length > 0) {
          services = await tx.servico.findMany({
            where: {
              ID: { in: Servicos },
            },
          });
          await tx.servicoAgendamento.createMany({
            data: services.map((servico) => ({
              AgendamentosId: id,
              ServicoId: servico.ID,
              Nome: servico.Nome,
              PrecoMin: servico.PrecoMin,
              PrecoMax: servico.PrecoMax,
            })),
          });
        }
        return agendamento;
      });
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao atualizar agendamento");
    }
  };

  static async getAtendimentoIdByAgendamentoId(agendamentoId: string): Promise<string | undefined> {
    const agendamento = await prisma.agendamentos.findUnique({
      where: { ID: agendamentoId },
      include: { Atendimento: true },
    });
    return agendamento?.Atendimento?.ID;
  }

  static async deleteAgendamento(id: string) {
    try {
      const atendimentoId = await AgendamentoService.getAtendimentoIdByAgendamentoId(id);
      if (atendimentoId) {
        await prisma.atendimento.delete({
          where: { ID: atendimentoId },
        });
      }
      return await prisma.agendamentos.delete({
        where: { ID: id },
      });
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao deletar agendamento");
    }
  }
  static updateAdicionarAtendimento = async (
    agendamentoId: string,
    atendimentoId: string
  ) => {
    try {
      return await prisma.agendamentos.update({
        where: { ID: agendamentoId },
        data: {
          Status: "Finalizado",
          Atendimento: {
            connect: { ID: atendimentoId },
          },
        },
      });
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao adicionar atendimento ao agendamento");
    }
  };
}

export default AgendamentoService;
