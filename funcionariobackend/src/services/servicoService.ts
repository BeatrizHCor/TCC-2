import prisma from "../config/database";
import { Prisma } from "@prisma/client";

class ServicoService {
  static async getServicos(
    skip: number | null = null,
    limit: number | null = null,
    nome: string,
    precoMin: number,
    precoMax: number,
    include = false,
    salaoId: string,
  ) {
    let whereCondition: Prisma.ServicoWhereInput = {};
    if (nome) {
      whereCondition.Nome = {
        contains: nome,
        mode: "insensitive",
      };
    }
    if (salaoId) {
      whereCondition.SalaoId = salaoId;
    }
    if (precoMin !== 0) {
      whereCondition.PrecoMin = { gte: precoMin };
    }

    if (precoMax !== 0) {
      whereCondition.PrecoMax = { lte: precoMax };
    }

    const query: any = {
      where: whereCondition,
    };

    if (skip !== null) {
      query.skip = skip;
    } else {
      query.skip = 0;
    }

    if (skip !== null) {
      query.take = limit;
    } else {
      query.take = 10;
    }

    if (include) {
      query.include = {
        Salao: true,
        ServicoAtendimento: true,
      };
    }
    query.orderBy = { Nome: "asc" };

    return await prisma.servico.findMany(query);
  }

  static async getServicoPage(
    page: number,
    limit: number,
    nome: string,
    precoMin: number,
    precoMax: number,
    includeRelations = false,
    salaoId: string,
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.ServicoWhereInput = {};
    if (salaoId) {
      where.SalaoId = salaoId;
    }
    if (precoMin !== 0) {
      where.PrecoMin = { gte: precoMin };
    }
    if (precoMin !== 0) {
      where.PrecoMax = { lte: precoMax };
    }
    if (nome) {
      where.Nome = { contains: nome, mode: "insensitive" };
    }

    const [total, servicos] = await Promise.all([
      prisma.servico.count({ where }),
      ServicoService.getServicos(
        skip,
        limit,
        nome,
        precoMin,
        precoMax,
        includeRelations,
        salaoId,
      ),
    ]);

    return {
      total: total,
      page: page,
      limit: limit,
      data: servicos,
    };
  }

  static async create(
    Nome: string,
    PrecoMin: number,
    PrecoMax: number,
    Descricao: string,
    SalaoId: string,
  ) {
    try {
      const servico = await prisma.servico.create({
        data: {
          Nome: Nome,
          SalaoId: SalaoId,
          PrecoMin: PrecoMin,
          PrecoMax: PrecoMax,
          Descricao: Descricao,
        },
      });
      return servico;
    } catch (error) {
      console.error("Erro ao criar serviço: ", error);
      throw new Error("Erro ao criar serviço");
    }
  }

  static async findById(ID: string, include = false) {
    try {
      return await prisma.servico.findUnique({
        where: {
          ID: ID,
        },
        ...(include
          ? {
            include: {
              Salao: true,
              ServicoAtendimento: true,
            },
          }
          : {}),
      });
    } catch (error) {
      console.error("Erro ao localizar serviço: ", error);
      return false;
    }
  }

  static async update(
    ID: string,
    Nome: string,
    PrecoMin: number,
    PrecoMax: number,
    Descricao: string,
    SalaoId: string,
  ) {
    try {
      return await prisma.servico.update({
        where: {
          ID: ID,
        },
        data: {
          Nome: Nome,
          PrecoMin: PrecoMin,
          PrecoMax: PrecoMax,
          Descricao: Descricao,
          SalaoId: SalaoId,
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar serviço: ", error);
      throw new Error("Erro ao atualizar serviço");
    }
  }

  static async delete(ID: string) {
    try {
      return await prisma.servico.delete({
        where: {
          ID: ID,
        },
      });
    } catch (error) {
      console.error("Erro ao excluir serviço: ", error);
      throw new Error("Erro ao excluir serviço");
    }
  }

  static async getServicosBySalao(SalaoId: string, include = false) {
    try {
      return await prisma.servico.findMany({
        where: {
          SalaoId: SalaoId,
        },
        ...(include
          ? {
            include: {
              ServicoAtendimento: true,
            },
          }
          : {}),
        orderBy: {
          Nome: "asc",
        },
      });
    } catch (error) {
      console.error("Erro ao buscar serviços do salão: ", error);
      throw new Error("Erro ao buscar serviços do salão");
    }
  }
  static async findServicoByNomeAndSalaoId(nome: string, salaoId: string) {
    try {
      return await prisma.servico.findMany({
        where: {
          SalaoId: salaoId,
          Nome: {
            contains: nome,
            mode: "insensitive",
          },
        },
        orderBy: {
          Nome: "asc",
        },
      });
    } catch (error) {
      console.error("Erro ao buscar serviço pelo nome", error);
      throw new Error("Erro ao buscar serviço pelo nome e salão");
    }
  }
}

export default ServicoService;
