import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { getRangeByDataInputWithTimezone } from "../utils/CalculoPeriododeTempo";
interface AtendimentoInput {
  data: Date;
  funcionarioId: string;
  salaoId: string;
  precoTotal: number;
  agendamentoId: string;
  auxiliarId?: string;
  servicos: { servicoId: string; precoItem: number }[];
}

class AtendimentoService {
  static async getAtendimentos(
    skip: number | null = null,
    limit: number | null = null,
    includeRelations = false,
    salaoId: string | null = null,
    nomeCliente: string | null = null,
    nomeCabeleireiro: string | null = null,
    dia: number = 0,
    mes: number = 0,
    ano: number = 0
  ) {
    const where: Prisma.AtendimentoWhereInput = {};

    if (salaoId !== null) {
      where.SalaoId = salaoId;
    }
    console.log("Valores d,m,a: ",dia,mes,ano)
    const range = getRangeByDataInputWithTimezone(ano,mes,dia);
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
              Funcionario: true,
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

  static async getAtendimentosPage(
    page = 1,
    limit = 10,
    includeRelations = false,
    salaoId: string | null = null,
    nomeCliente: string | null = null,
    nomeCabeleireiro: string | null = null,
    dia: number = 0,
    mes: number = 0,
    ano: number = 0
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.AtendimentoWhereInput = {};
    const range = getRangeByDataInputWithTimezone(ano,mes,dia);
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
        dia,
        mes,
        ano
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
              Funcionario: true,
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

    static async createAtendimento(data: AtendimentoInput) {
    const {
        data: dataAtendimento,
        funcionarioId,
        salaoId,
        precoTotal,
        agendamentoId,
        auxiliarId,
        servicos,
    } = data;

    const atendimento = await prisma.atendimento.create({
        data: {
        Data: dataAtendimento,
        FuncionarioID: funcionarioId,
        SalaoId: salaoId,
        PrecoTotal: precoTotal,
        Auxiliar: !!auxiliarId,
        Agendamentos: {
            connect: {
            ID: agendamentoId,
            },
        },
        ServicoAtendimento: {
            create: servicos.map((s) => ({
            PrecoItem: s.precoItem,
            Servico: {
                connect: { ID: s.servicoId },
            },
            })),
        },
        ...(auxiliarId && {
            AtendimentoAuxiliar: {
            create: {
                AuxiliarID: auxiliarId,
                SalaoId: salaoId,
            },
            },
        }),
        },
        include: {
        ServicoAtendimento: true,
        AtendimentoAuxiliar: true,
        Agendamentos: true,
        },
    });

    return atendimento;
    }

  static async updateAtendimento(id: string, data: AtendimentoInput) {
    const {
        data: dataAtendimento,
        funcionarioId,
        salaoId,
        precoTotal,
        agendamentoId,
        auxiliarId,
        servicos,
    } = data;
    try{
    const atendimento = await prisma.atendimento.update({
        where: { ID: id },
        data: {
        Data: dataAtendimento,
        FuncionarioID: funcionarioId,
        SalaoId: salaoId,
        PrecoTotal: precoTotal,
        Agendamentos: {
            set: { ID: agendamentoId },
        },
        ServicoAtendimento: {
            deleteMany: {},
            create: servicos.map((s) => ({
            PrecoItem: s.precoItem,
            Servico: {
                connect: { ID: s.servicoId },
            },
            })),
        },
        AtendimentoAuxiliar: auxiliarId
            ? {
                upsert: {
                create: {
                    AuxiliarID: auxiliarId,
                    SalaoId: salaoId,
                },
                update: {
                    AuxiliarID: auxiliarId,
                    SalaoId: salaoId,
                },
                },
            }
            : {
                delete: true,
            },
        },
        include: {
        ServicoAtendimento: true,
        AtendimentoAuxiliar: true,
        Agendamentos: true,
        },
    });
    return atendimento;
    } catch (error) {
        console.error("Erro ao atualizar atendimento:", error);
        throw new Error("Não foi possível atualizar o atendimento");
    }
  }

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