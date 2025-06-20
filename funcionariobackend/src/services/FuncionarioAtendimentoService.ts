import {
  AtendimentoAuxiliar,
  Prisma,
  ServicoAtendimento,
} from "@prisma/client";
import prisma from "../config/database";
import {
  getRangeByDataInputWithTimezone,
  getRangeByStringInputWithTimezone,
} from "../utils/CalculoPeriododeTempo";

class AtendimentoService {
  static async getAtendimentos(
    skip: number,
    limit: number,
    includeRelations = false,
    salaoId: string | null = null,
    nomeCliente: string | null = null,
    nomeCabeleireiro: string | null = null,
    data: string | null = null
  ) {
    const where: Prisma.AtendimentoWhereInput = {};

    if (salaoId !== null) {
      where.SalaoId = salaoId;
    }
    console.log("Valores d,m,a: ", data);
    const range = getRangeByStringInputWithTimezone(data);
    if (range !== null) {
      where.Data = {
        gte: range.dataInicial,
        lte: range.dataFinal,
      };
    }
    if (nomeCabeleireiro && nomeCliente) {
      where.Agendamentos = {
        some: {
          AND: [
            {
              Cabeleireiro: {
                Nome: {
                  contains: nomeCabeleireiro,
                  mode: "insensitive",
                },
              },
            },
            {
              Cliente: {
                Nome: {
                  contains: nomeCliente,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      };
    } else if (nomeCabeleireiro) {
      where.Agendamentos = {
        some: {
          Cabeleireiro: {
            Nome: {
              contains: nomeCabeleireiro,
              mode: "insensitive",
            },
          },
        },
      };
    } else if (nomeCliente) {
      where.Agendamentos = {
        some: {
          Cliente: {
            Nome: {
              contains: nomeCliente,
              mode: "insensitive",
            },
          },
        },
      };
    }
    return prisma.atendimento.findMany({
      ...(skip !== null ? { skip } : {}),
      ...(limit !== null ? { take: limit } : {}),
      where,
      ...(includeRelations
        ? {
            include: {
              Salao: false,
              AtendimentoAuxiliar: {
                include: { Auxiliar: true },
              },
              Agendamentos: {
                include: {
                  Cliente: true,
                  Cabeleireiro: true,
                  ServicoAgendamento: true,
                },
              },
              ServicoAtendimento: true,
            },
          }
        : {}),
    });
  }

  static async getAtendimentosPage(
    page = 1,
    limit = 10,
    includeRelations = false,
    salaoId: string | null = null,
    nomeCliente: string | null = null,
    nomeCabeleireiro: string | null = null,
    data: string | null = null
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.AtendimentoWhereInput = {};
    const range = getRangeByStringInputWithTimezone(data);
    if (salaoId !== null) {
      where.SalaoId = salaoId;
    }
    if (range !== null) {
      where.Data = {
        gte: range.dataInicial,
        lte: range.dataFinal,
      };
    }
    if (nomeCabeleireiro && nomeCliente) {
      where.Agendamentos = {
        some: {
          AND: [
            {
              Cabeleireiro: {
                Nome: {
                  contains: nomeCabeleireiro,
                  mode: "insensitive",
                },
              },
            },
            {
              Cliente: {
                Nome: {
                  contains: nomeCliente,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      };
    } else if (nomeCabeleireiro) {
      where.Agendamentos = {
        some: {
          Cabeleireiro: {
            Nome: {
              contains: nomeCabeleireiro,
              mode: "insensitive",
            },
          },
        },
      };
    } else if (nomeCliente) {
      where.Agendamentos = {
        some: {
          Cliente: {
            Nome: {
              contains: nomeCliente,
              mode: "insensitive",
            },
          },
        },
      };
    }
    const [total, atendimentos] = await Promise.all([
      prisma.atendimento.count({ where }),
      AtendimentoService.getAtendimentos(
        skip,
        limit,
        includeRelations,
        salaoId,
        nomeCliente,
        nomeCabeleireiro,
        data
      ),
    ]);

    return {
      total: total,
      page,
      limit,
      data: atendimentos,
    };
  }

  static async findById(id: string, includeRelations = false) {
    return prisma.atendimento.findUnique({
      where: { ID: id },
      ...(includeRelations
        ? {
            include: {
              Salao: true,
              AtendimentoAuxiliar: {
                include: { Auxiliar: true },
              },
              Agendamentos: {
                include: { Cliente: true },
              },
              ServicoAtendimento: true,
            },
          }
        : {}),
    });
  }

  static async findByAgendamento(agendamentoId: string) {
    return prisma.atendimento.findFirst({
      where: {
        Agendamentos: {
          every: {
            ID: agendamentoId,
          },
        },
      },

      include: {
        Salao: true,
        AtendimentoAuxiliar: {
          include: { Auxiliar: true },
        },
        Agendamentos: {
          include: { Cliente: true },
        },
        ServicoAtendimento: true,
      },
    });
  }

  static createAtendimento = async (
    Data: Date,
    PrecoTotal: number,
    Auxiliar: boolean,
    SalaoId: string,
    servicosAtendimento: ServicoAtendimento[] = [],
    auxiliares: AtendimentoAuxiliar[] = []
  ) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const atendimento = await tx.atendimento.create({
          data: {
            Data,
            PrecoTotal,
            Auxiliar,
            SalaoId,
          },
        });
        if (servicosAtendimento.length > 0) {
          await tx.servicoAtendimento.createMany({
            data: servicosAtendimento.map((servico) => ({
              AtendimentoId: atendimento.ID,
              ServicoId: servico.ServicoId,
              PrecoItem: servico.PrecoItem,
            })),
          });
        }
        if (auxiliares.length > 0) {
          await tx.atendimentoAuxiliar.createMany({
            data: auxiliares.map((aux) => ({
              AtendimentoId: atendimento.ID,
              AuxiliarID: aux.AuxiliarID,
            })),
          });
        }

        return atendimento;
      });
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao criar atendimento");
    }
  };

  static updateAtendimento = async (
    id: string,
    Data: Date,
    PrecoTotal: number,
    Auxiliar: boolean,
    SalaoId: string,
    servicosAtendimento: ServicoAtendimento[] = [],
    auxiliares: AtendimentoAuxiliar[] = []
  ) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const atendimento = await tx.atendimento.update({
          where: { ID: id },
          data: {
            Data,
            PrecoTotal,
            Auxiliar,
            SalaoId,
          },
        });

        await tx.servicoAtendimento.deleteMany({
          where: { AtendimentoId: id },
        });

        if (servicosAtendimento.length > 0) {
          await tx.servicoAtendimento.createMany({
            data: servicosAtendimento.map((servico) => ({
              AtendimentoId: id,
              ServicoId: servico.ServicoId,
              PrecoItem: servico.PrecoItem,
            })),
          });
        }
        await tx.atendimentoAuxiliar.deleteMany({
          where: { AtendimentoId: id },
        });

        if (auxiliares.length > 0) {
          await tx.atendimentoAuxiliar.createMany({
            data: auxiliares.map((aux) => ({
              AtendimentoId: id,
              AuxiliarID: aux.AuxiliarID,
            })),
          });
        }

        return atendimento;
      });
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao atualizar atendimento");
    }
  };
  static async deleteAtendimento(id: string) {
    try {
      if (!id) {
        throw new Error("ID do atendimento não informado");
      }
      const deleted = await prisma.atendimento.delete({
        where: { ID: id },
      });
      return deleted;
    } catch (error) {
      console.error("Erro ao deletar atendimento:", error);
      throw new Error("Não foi possível deletar o atendimento");
    }
  }
}

export default AtendimentoService;
