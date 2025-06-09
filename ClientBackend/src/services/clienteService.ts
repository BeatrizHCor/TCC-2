import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { getRangeByStringInputWithTimezone } from "../utils/CalculoPeriododeTempo"
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
    salaoId: string | null = null,
    termoBusca: string,
    campoBusca: string,
    dataFilter: string
  ) {

    const where: Prisma.ClienteWhereInput = {};
    const range = getRangeByStringInputWithTimezone(dataFilter);
    if (range !== null) {
      where.DataCadastro = {
      gte: range.dataInicial,
      lte: range.dataFinal,
      };
    }  
    if (salaoId && salaoId !== null) {
      where.SalaoId = salaoId;
    }
    if (termoBusca && campoBusca) {
      Object.assign(where, {
        [campoBusca]: {
        contains: termoBusca,
        mode: 'insensitive',
        },
      });
    }
    return await prisma.cliente.findMany({
      ...(skip !== null ? { skip } : {}),
      ...(limit !== null ? { take: limit } : {}),
          where: where,
      ...(include
        ? {
            include: {
              Agendamentos: true,
              HistoricoSimulacao: true,
            },
          }
        : {}),
    });
  }
  
  static async getClientePage(
    page = 1,
    limit = 10,
    salaoId: string,
    includeRelations = false,
    termoBusca: string,
    campoBusca: string,
    dataFilter: string
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.ClienteWhereInput = {};
    const range = getRangeByStringInputWithTimezone(dataFilter);
    if (range !== null) {
      where.DataCadastro = {
      gte: range.dataInicial,
      lte: range.dataFinal,
      };
    }  
    if (salaoId) {
      where.SalaoId = salaoId;
    }
    if (termoBusca && campoBusca) {
      Object.assign(where, {
        [campoBusca]: {
        contains: termoBusca,
        mode: 'insensitive',
      },
    });
   }
    const [total, clientes] = await Promise.all([
      prisma.cliente.count({ where }),
      ClienteService
        .getClientes(
          skip, 
          limit, 
          includeRelations, 
          salaoId, 
          termoBusca, 
          campoBusca, 
          dataFilter),
    ]);
  
    return {
      total: total,
      page,
      limit,
      data: clientes,
    };
  }
  
  static async create(
    CPF: string,
    Nome: string,
    Email: string,
    Telefone: string,
    SalaoId: string
  ) {
    const existingCliente = await this.findByEmailandSalao(Email, SalaoId);
    if (existingCliente) {
      console.error("Cliente já cadastrado neste salão:", { Email, SalaoId });
      throw new Error("Cliente já cadastrado neste salão");
    }
    try {
      const cliente = await prisma.cliente.create({
        data: {
          CPF: CPF,
          Nome: Nome,
          Email: Email,
          Telefone: Telefone,
          SalaoId: SalaoId,
        },
      });
      console.log(cliente);
      return cliente;
    } catch (error) {
      throw new Error("Erro ao criar cliente");
    }
  }

  static async findById(ID: string, include = false) {
    try {
      return await prisma.cliente.findUnique({
        where: {
          ID,
        },
        ...(include
          ? {
              include: {
                Salao: true,
                Agendamentos: true,
                HistoricoSimulacao: true,
              },
            }
          : {}),
      });
    } catch (error) {
      throw new Error("Erro ao localizar cliente ID");
    }
  }

  static async findByEmailandSalao(
    Email: string,
    salaoId: string,
    include = false
  ) {
    try {
      return await prisma.cliente.findUnique({
        where: {
          Email_SalaoId: {
            Email: Email,
            SalaoId: salaoId,
          },
        },
        ...(include
          ? {
              include: {
                Salao: true,
                Agendamentos: true,
                HistoricoSimulacao: true,
              },
            }
          : {}),
      });
    } catch (error) {
      console.error("Erro ao localizar cliente:", error);
      throw new Error("Erro ao localizar cliente");
    }
  }

  static async findByCpfandSalao(
    Cpf: string,
    salaoId: string,
    include = false
  ) {
    try {
      return await prisma.cliente.findFirst({
        where: {
          CPF: Cpf,
          SalaoId: salaoId,
        },
        ...(include
          ? {
              include: {
                Salao: true,
                Agendamentos: true,
                HistoricoSimulacao: true,
              },
            }
          : {}),
      });
    } catch (error) {
      throw new Error("Erro ao localizar cliente");
    }
  }

  static async update(Id: string, data: ClienteData) {
    try {
      const existingCliente = await this.findById(Id);
      if (!existingCliente) {
        throw new Error("Cliente já cadastrado neste salão");
      }

      return await prisma.cliente.update({
        where: {
          ID: Id,
        },
        data: data,
      });
    } catch (error) {
      throw new Error("Erro ao atualizar cliente");
    }
  }

  static async delete(Id: string) {
    return await prisma.cliente.delete({
      where: {
        ID: Id,
      },
    });
  }
}
export default ClienteService;