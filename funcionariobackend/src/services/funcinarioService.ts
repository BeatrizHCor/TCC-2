import prisma from "../config/database";

interface FuncionarioData {
  CPF: string;
  Nome: string;
  Email: string;
  Telefone: string;
  SalaoId: string;
  Auxiliar: boolean;
  Salario: number;
}

class FuncionarioService {
  static async getFuncionarios(
    skip: number | null = null,
    limit: number | null = null,
    nome: string | null = null,
    include = false,
    salaoId: string | null = null
  ) {
    return await prisma.funcionario.findMany({
      ...(skip !== null ? { skip } : {}),
      ...(limit !== null ? { take: limit } : {}),
      ...(salaoId !== null || nome !== null
        ? {
            where: {
              ...(salaoId ? { SalaoId: salaoId } : {}),
              ...(nome ? { Nome: { contains: nome , mode:'insensitive' } } : {}),
            },
          }
        : {}),
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

    const [total, funcionarios] = await Promise.all([
      FuncionarioService.getFuncionarios(null, null, nome, false, salaoId),
      FuncionarioService.getFuncionarios(skip, limit, nome, includeRelations, salaoId),
    ]);

    return {
      total: total.length,
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
      return true;
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

  static async update(Email: string, salaoId: string, data: FuncionarioData) {
    try {
      const existingFuncionario = await this.findByEmailandSalao(
        Email,
        salaoId
      );
      if (!existingFuncionario) {
        throw new Error("Funcionário não encontrado");
      }

      return await prisma.funcionario.update({
        where: {
          Email_SalaoId: {
            Email: Email,
            SalaoId: salaoId,
          },
        },
        data: data,
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