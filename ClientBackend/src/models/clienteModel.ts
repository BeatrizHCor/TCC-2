import prisma from "../config/database";

class ClienteModel {
  static async findMany(include = false) {
    return await prisma.cliente.findMany({
      ...(include ? {
        include: {
          Salao: true, 
          Agendamentos: true, 
          HistoricoSimulacao: true 
        }
      } : {})
    });
  }

  static async create(data: { 
    CPF: string; 
    Nome: string; 
    Email: string; 
    Telefone: string; 
    Senha: string; 
    SalaoId: string 
  }) {
    return await prisma.cliente.create({ data });
  }

  static async findByEmail(email: string, include = false) {
    return await prisma.cliente.findFirstOrThrow({
      where: { Email: email },
      ...(include ? {
        include: {
          Salao: true,
          Agendamentos: true,
          HistoricoSimulacao: true
        }
      } : {})
    });
  }

  static async findByCPFandSalao(cpf: string, salaoId: string, include = false) {
    return await prisma.cliente.findUnique({
      where: {
        CPF_SalaoId: {
          CPF: cpf,
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

  static async update(cpf: string, salaoId: string, data: Partial<{
    Nome: string;
    Email: string;
    Telefone: string;
    Senha: string;
  }>) {
    return await prisma.cliente.update({
      where: { 
        CPF_SalaoId: {
          CPF: cpf,
          SalaoId: salaoId
        }
      },
      data: data,
    });
  }

  static async delete(cpf: string, salaoId: string) {
    return await prisma.cliente.delete({
      where: { 
        CPF_SalaoId: {
          CPF: cpf,
          SalaoId: salaoId
        }
      },
    });
  }
}

export default ClienteModel;