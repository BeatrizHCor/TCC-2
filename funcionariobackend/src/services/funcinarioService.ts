import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { isValidString } from "../utils/ValidacaoValoresBusca";


class FuncionarioService {
  static async getFuncionarios(
    skip: number | null = null,
    limit: number | null = null,
    nome: string | null = null,
    include = false,
    salaoId: string | null = null
  ) {
    let whereCondition: Prisma.FuncionarioWhereInput = {};
    if (isValidString(nome)) {
      whereCondition.Nome = {
        contains: nome,
        mode: 'insensitive',
      };
    if (isValidString(salaoId)) {
        whereCondition.SalaoId = salaoId;
      }
    }
    return await prisma.funcionario.findMany({
      ...(skip !== null ? { skip } : {}),
      ...(limit !== null ? { take: limit } : {}),
      where: whereCondition,           
      ...(include
        ? {
            include: {
              Atendimentos: true,
              AtendimentoAuxiliar: true,
              Holerite: true,
              Salao: true,
            },
          }
        : {}),
    });
  }

  static async getFuncionarioPage(
    page = 1,
    limit = 10,
    nome: string | null = null,
    includeRelations = false,
    salaoId: string | null = null
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.FuncionarioWhereInput = {};
    if (salaoId !== null) {
      where.SalaoId = salaoId;
    }
    if (isValidString(nome)){
      where.Nome = { contains: nome, mode: 'insensitive' };
    }
    const [total, funcionarios] = await Promise.all([
      prisma.funcionario.count({where}),
      FuncionarioService.getFuncionarios(skip, limit, nome, includeRelations, salaoId),
    ]);

    return {
      total: total,
      page,
      limit,
      data: funcionarios,
    };
  }

  static async create(
    CPF: string,
    Nome: string,
    Email: string,
    Telefone: string,
    SalaoId: string,
    Auxiliar: boolean,
    Salario: number
  ) {
    const existingFuncionario = await this.findByEmailandSalao(Email, SalaoId);
    if (existingFuncionario) {
      console.error('Funcionário já cadastrado neste salão:', { Email, SalaoId });
      throw new Error('Funcionário já cadastrado neste salão');
    }
    try {
      const funcionario = await prisma.funcionario.create({
        data: {
          CPF: CPF,
          Nome: Nome,
          Email: Email,
          Telefone: Telefone,
          SalaoId: SalaoId,
          Auxiliar: Auxiliar,
          Salario: Salario
        },
      });
      console.log(funcionario);
      return funcionario;
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw new Error('Erro ao criar funcionário');
    }
  }

  static async findById(ID: string, include = false) {
    try {
      return await prisma.funcionario.findUnique({
        where: {
          ID: ID,
        },
        ...(include
          ? {
              include: {
                Salao: true,
                Atendimentos: true,
                AtendimentoAuxiliar: true,
                Holerite: true
              },
            }
          : {}),
      });
    } catch (error) {
      return false;
    }
  }

  static async findByEmailandSalao(Email: string, salaoId: string, include = false) {
    console.log('Buscando funcionário com Email e SalaoId:', { Email, salaoId });
    try {
      return await prisma.funcionario.findUnique({
        where: {
          Email_SalaoId: {
            Email: Email,
            SalaoId: salaoId
          }
        },
        ...(include ? {
          include: {
            Salao: true,
            Atendimentos: true,
            AtendimentoAuxiliar: true,
            Holerite: true
          }
        } : {})
      });
    }
    catch (error) {
      console.error('Erro ao localizar funcionário:', error);
      throw new Error('Erro ao localizar funcionário');
    }
  }

  static async findByCpfandSalao(
    Cpf: string,
    salaoId: string,
    include = false
  ) {
    try {
      return await prisma.funcionario.findFirst({
        where: {
          CPF: Cpf,
          SalaoId: salaoId,
        },
        ...(include
          ? {
              include: {
                Salao: true,
                Atendimentos: true,
                AtendimentoAuxiliar: true,
                Holerite: true
              },
            }
          : {}),
      });
    } catch (error) {
      throw new Error("Erro ao localizar funcionário");
    }
  }

  static async update(
        id: string,         
        Nome: string,
        CPF: string,
        Email: string,
        Telefone: string,
        SalaoId: string,
        Auxiliar: boolean,
        Salario: number
  ) {
    try {
      const existingFuncionario = await this.findById(id)
      if (!existingFuncionario) {
        throw new Error("Funcionário não encontrado");
      }
      return await prisma.funcionario.update({
        where: {
          ID: id,
        },
        data: {
          Nome,
          CPF,
          Email,
          Telefone,
          SalaoId,
          Auxiliar,
          Salario
        },
      });
    } catch (error) {
      throw new Error("Erro ao atualizar funcionário");
    }
  }

  static async delete(Email: string, salaoId: string) {
    const existingFuncionario = await this.findByEmailandSalao(Email, salaoId);
    if (!existingFuncionario) {
      throw new Error("Funcionário não encontrado");
    }
    return await prisma.funcionario.delete({
      where: {
        Email_SalaoId: {
          Email: Email,
          SalaoId: salaoId,
        },
      },
    });
  }

  static async deleteById(ID: string) {
    const existingFuncionario = await this.findById(ID);
    if (!existingFuncionario) {
      throw new Error("Funcionário não encontrado");
    }
    return await prisma.funcionario.delete({
      where: {
        ID: ID,
      },
    });
  }
}

export default FuncionarioService;