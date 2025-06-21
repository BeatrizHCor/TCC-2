import {
  Agendamentos,
  Prisma,
  Servico,
  ServicoAgendamento,
  StatusAgendamento,
} from "@prisma/client";
import prisma from "../config/database";
import { getRangeByDataInputWithTimezone } from "../utils/CalculoPeriododeTempo";

class AgendamentoService {
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
    const range = getRangeByDataInputWithTimezone(ano, mes, dia);
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
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao buscar agendamento");
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
    servicosIds: string[] = []
  ) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const agendamento = await tx.agendamentos.update({
          where: { ID: id },
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
        if (servicosIds.length > 0) {
          let services = await tx.servico.findMany({
            where: {
              ID: { in: servicosIds },
            },
          });
          console.log(servicosIds);
          console.log(services);
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

        console.log("Agendamento encontrado e atualizado", agendamento);
        return agendamento;
      });
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao atualizar agendamento");
    }
  };

  static async deleteAgendamento(id: string) {
    try {
      let atendimentoId = (
        await prisma.agendamentos.findUnique({
          where: {
            ID: id,
          },
          include: {
            Atendimento: true,
          },
        })
      )?.Atendimento?.ID;
      await prisma.atendimento.delete({
        where: {
          ID: atendimentoId,
        },
      });
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
          Status: "Confirmado",
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
