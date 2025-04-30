import prisma from "../config/database";
import { PrismaClient } from "@prisma/client";

class ServicoService {
  static async getServicos(
    skip: number | null = null,
    limit: number | null = null,
    nome?: string,
    precoMin?: number,
    precoMax?: number,
    include = false,
    salaoId: string | null = null
  ) {
    let whereCondition: any = {};

    if (salaoId) {
      whereCondition.SalaoId = salaoId;
    }

    if (nome) {
      whereCondition.Nome = {
        contains: nome,
        mode: 'insensitive',
      };
    }

    if (precoMin != null && !isNaN(precoMin)) {
      whereCondition.PrecoMin = { gte: precoMin };
    }

    if (precoMax != null && !isNaN(precoMax)) {
      whereCondition.PrecoMax = { lte: precoMax };
    }

    const query: any = {
      where: whereCondition,
    };

    if (typeof skip === 'number' && !isNaN(skip)) {
      query.skip = skip;
    } else {
      query.skip = 0; 
    }

    if (typeof limit === 'number' && !isNaN(limit)) {
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
    console.log("Query gerada:", query);
    return await prisma.servico.findMany(query);
  }
  
  static async getServicoPage(
    page = 1,
    limit = 10,
    nome?: string,
    precoMin?: number,
    precoMax?: number,
    includeRelations = false,
    salaoId: string | null = null
  ) {
    const pageNum = isNaN(page) ? 1 : page;
    const limitNum = isNaN(limit) ? 10 : limit;
    const skip = (pageNum - 1) * limitNum;
  
    const [total, servicos] = await Promise.all([
      ServicoService.getServicos(null, null, nome, precoMin, precoMax, false, salaoId),
      ServicoService.getServicos(skip, limitNum, nome, precoMin, precoMax, includeRelations, salaoId),
    ]);
  
    return {
      total: total.length,
      page: pageNum,
      limit: limitNum,
      data: servicos,
    };
  }
  
  static async create(
    Nome: string,
    PrecoMin: number,
    PrecoMax: number,
    Descricao: string,
    SalaoId: string
  ) {
    if (PrecoMin > PrecoMax) {
      throw new Error('Preço mínimo não pode ser maior que o preço máximo');
    }

    console.log('Dados enviados para criação:', { Nome, PrecoMin, PrecoMax, Descricao, SalaoId });
    
    try {
      const servico = await prisma.servico.create({
        data: {
          Nome,
          SalaoId,
          PrecoMin,
          PrecoMax,
          Descricao,          
        },
      });
      
      console.log(servico);
      return servico;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw new Error('Erro ao criar serviço');
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
      console.error('Erro ao localizar serviço:', error);
      return false;
    }
  }

  static async findByNomeAndSalao(Nome: string, SalaoId: string, include = false) {
    console.log('Buscando serviço com Nome e SalaoId:', { Nome, SalaoId });
    try {
      return await prisma.servico.findFirst({
        where: {
          Nome,
          SalaoId,
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
      console.error('Erro ao localizar serviço:', error);
      throw new Error('Erro ao localizar serviço');
    }
  }

  static async update(
    ID: string, 
    Nome: string,
    PrecoMin: number,
    PrecoMax: number,
    Descricao: string,
    SalaoId: string) {
    try {
      const existingServico = await this.findById(ID);
      
      if (!existingServico) {
        throw new Error("Serviço não encontrado");
      }
      if (PrecoMin > PrecoMax) {
        throw new Error('Preço mínimo não pode ser maior que o preço máximo');
      }
      return await prisma.servico.update({
        where: {
          ID: ID,
        },
        data: {
          Nome,
          PrecoMin,
          PrecoMax,
          Descricao,
          SalaoId,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw new Error("Erro ao atualizar serviço");
    }
  }

  static async delete(ID: string) {
    try {
      const existingServico = await this.findById(ID);
      
      if (!existingServico) {
        throw new Error("Serviço não encontrado");
      }
      
      return await prisma.servico.delete({
        where: {
          ID: ID,
        },
      });
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
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
      });
    } catch (error) {
      console.error('Erro ao buscar serviços do salão:', error);
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
            mode: 'insensitive',
          },
        },
      });
    } catch (error) {
      console.error('Erro ao buscar serviço pelo nome', error);
      throw new Error("Erro ao buscar serviço pelo nome e salão");
    }
  }
}

export default ServicoService;