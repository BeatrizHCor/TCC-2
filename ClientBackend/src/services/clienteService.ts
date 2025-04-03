import { skip } from "node:test";
import prisma from "../config/database";

interface ClienteData {
  CPF: string;
  Nome: string;
  Email: string;
  Telefone: string;
  SalaoId: string;
}

class ClienteService {
  static async getClientes(
    skip: number | null = null, 
    limit: number | null = null, 
    include = false, 
    salaoId: string | null = null
  ) {
    return await prisma.cliente.findMany({
      ...(skip !== null ? { skip } : {}),
      ...(limit !== null ? { take: limit } : {}),
      ...(salaoId !== null ? { where: { SalaoId: salaoId } } : {}),
      ...(include ? {
        include: {
          Agendamentos: true,
          HistoricoSimulacao: true
        }
      } : {})
    });
  }
  
  static async getClientePage(
    page = 1, 
    limit = 10, 
    includeRelations = false, 
    salaoId: string | null = null
  ) {
    const skip = (page - 1) * limit;

    const [total, clientes] = await Promise.all([
      ClienteService.getClientes(null, null, false, salaoId), 
      ClienteService.getClientes(skip, limit, includeRelations, salaoId) 
    ]);

    return {
      total: total.length,
      page,
      limit,
      data: clientes
    };
  }

  static async create(  
    CPF: string,
    Nome: string,
    Email: string,
    Telefone: string,
    SalaoId: string,
  ) {
    const existingCliente = await this.findByEmailandSalao(Email, SalaoId);
    if (existingCliente) {
      throw new Error('Cliente já cadastrado neste salão');
    }
    try {
      await prisma.cliente.create({ 
        data:{
        CPF,
        Nome,
        Email,
        Telefone,
        SalaoId,
      },
      });
      return true;
    }
    catch (error) {

    return false;

    }
  }
  static async findById(ID: string, include = false) {
    try {
      return await prisma.cliente.findUnique({
        where: {
            ID: ID,
  
          
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
      throw new Error('Erro ao localizar cliente');
    }
  }

  static async findByCpfandSalao(Cpf: string, salaoId: string, include = false) {
    try {
     return await prisma.cliente.findFirst({
       where: {
           CPF: Cpf,
           SalaoId: salaoId
         
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
      throw new Error('Erro ao localizar cliente');
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
    throw new Error('Erro ao atualizar cliente');
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



}

export default ClienteService;