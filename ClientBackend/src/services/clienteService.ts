import { skip } from "node:test";
import prisma from "../config/database";



interface ClienteData {
  CPF: string;
  Nome: string;
  Email: string;
  Telefone: string;
  Senha: string;
  SalaoId: string;
}

class ClienteService {
  static async getClientes(skip: number | null = null, limit: number | null = null, include = false) {
    return await prisma.cliente.findMany({
      ...(skip !== null ? { skip } : {}),
      ...(limit !== null ? { take: limit } : {}),      
      ...(include ? {
        include: {
          Agendamentos: true, 
          HistoricoSimulacao: true 
        }
      } : {})
    });
  }
  
  static async getClientePage(page = 1, limit = 10, includeRelations = false) {
    const skip = (page - 1) * limit;
    
    const [total, clientes] = await Promise.all([
      ClienteService.getClientes(),
      ClienteService.getClientes(page, limit, includeRelations)
    ]);

    return {
      total: total.length,
      page,
      limit,
      data: clientes
    };
  }

  static async create(data: ClienteData) {
    this.validateClienteData(data);
    const existingCliente = await this.findByEmailandSalao(data.Email, data.SalaoId);
    if (existingCliente) {
      throw new Error('Cliente já cadastrado neste salão');
    }

    try {
      await prisma.cliente.create({ data });
      return true;
    }
    catch (error) {

    return false;

    }
  }

  static async findByEmailandSalao(Email: string, salaoId: string, include = false) {
   try {
    return await prisma.cliente.findUnique({
      where: {
        Email_SalaoId: {
          Email: Email,
          SalaoId: salaoId
        }
      },
      ...(include ? {
        include: {
          Salao: true,
          Agendamentos: true,
          HistoricoSimulacao: true
        }
      } : {})
    });
    }
    catch (error) {
     return false;
    }
  }

  static async update(Email: string, salaoId: string, data: ClienteData) {
   try {
    const existingCliente = await this.findByEmailandSalao(data.Email, data.SalaoId);
    if (!existingCliente) {
      throw new Error('Cliente já cadastrado neste salão');
    }

    return await prisma.cliente.update({
      where: { 
        Email_SalaoId: {
          Email: Email,
          SalaoId: salaoId
        }
      },
      data: data,
    });;
  } catch (error) {
    throw new Error('Erro ao atualizar cliente: ');
  }
}

  static async delete(Email: string, salaoId: string) {
    const existingCliente = await this.findByEmailandSalao(Email, salaoId);
    if (!existingCliente) {
      throw new Error('Cliente já cadastrado neste salão');
    }
    return await prisma.cliente.delete({
      where: { 
        Email_SalaoId: {
          Email: Email,
          SalaoId: salaoId
        }
      },
    });
  }

  
  private static validateClienteData(data: ClienteData) {
    const { CPF, Nome, Email, Telefone, Senha, SalaoId } = data;

    if (!CPF) throw new Error('CPF é obrigatório');
    if (!Nome) throw new Error('Nome é obrigatório');
    if (!Email) throw new Error('Email é obrigatório');
    if (!Telefone) throw new Error('Telefone é obrigatório');
    if (!Senha) throw new Error('Senha é obrigatória');
    if (!SalaoId) throw new Error('SalaoId é obrigatório');

  }

}

export default ClienteService;