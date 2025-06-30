import { Prisma, StatusCadastro } from "@prisma/client";
import prisma from "../config/database";

class CabeleireiroService {
  static getCabeleireiros = async (
    skip: number | null = null,
    limit: number | null = null,
    include = false,
    salaoId: string | null = null,
    mostrarDesativados: boolean,
    nome: string | null = null,
  ) => {
    let where: Prisma.CabeleireiroWhereInput = {};
    if (nome && nome.trim().length > 0) {
      where.Nome = {
        contains: nome,
        mode: "insensitive",
      };
    }
    if (salaoId) {
      where.SalaoId = salaoId;
    }
    if (!mostrarDesativados) {
      where.Status = StatusCadastro.ATIVO;
    }
    return await prisma.cabeleireiro.findMany({
      ...(skip !== null ? { skip } : {}),
      ...(limit !== null ? { take: limit } : {}),
      where: where,
      ...(include
        ? {
          include: {
            Agendamentos: true,
          },
        }
        : {}),
      orderBy: {
        Nome: "asc",
      },
    });
  };

  static getCabeleireiroPage = async (
    page = 1,
    limit = 10,
    includeRelations = false,
    salaoId: string | null = null,
    mostrarDesativados: boolean,
    nome: string | null = null,
  ) => {
    const skip = (page - 1) * limit;
    const where: Prisma.CabeleireiroWhereInput = {};
    if (salaoId) {
      where.SalaoId = salaoId;
    }
    if (nome && nome.trim().length > 0) {
      where.Nome = {
        contains: nome,
        mode: "insensitive",
      };
    }
    if (!mostrarDesativados) {
      where.Status = StatusCadastro.ATIVO;
    }
    const [total, cabeleireiros] = await Promise.all([
      await prisma.cabeleireiro.count({ where }),
      CabeleireiroService.getCabeleireiros(
        skip,
        limit,
        includeRelations,
        salaoId,
        mostrarDesativados,
        nome,
      ),
    ]);

    return {
      total: total,
      page,
      limit,
      data: cabeleireiros,
    };
  };
  static getCabeleireirosNomes = async (
    skip: number | null = null,
    limit: number | null = null,
    salaoId: string | null = null,
    nome: string | null = null,
  ) => {
    let where: Prisma.CabeleireiroWhereInput = {};
    if (nome && nome.trim().length > 0) {
      where.Nome = {
        contains: nome,
        mode: "insensitive",
      };
    }
    if (salaoId) {
      where.SalaoId = salaoId;
    }
    where.Status = StatusCadastro.ATIVO;
    return await prisma.cabeleireiro.findMany({
      ...(skip !== null ? { skip } : {}),
      ...(limit !== null ? { take: limit } : {}),
      where: where,
      select: {
        ID: true,
        Nome: true,
      },
      orderBy: {
        Nome: "asc",
      },
    });
  };

  static getCabeleireiroNomePage = async (
    page = 1,
    limit = 10,
    salaoId: string | null = null,
    nome: string | null = null,
  ) => {
    const skip = (page - 1) * limit;
    const where: Prisma.CabeleireiroWhereInput = {};
    if (salaoId) {
      where.SalaoId = salaoId;
    }
    if (nome && nome.trim().length > 0) {
      where.Nome = {
        contains: nome,
        mode: "insensitive",
      };
    }
    where.Status = StatusCadastro.ATIVO;
    const [total, cabeleireiros] = await Promise.all([
      await prisma.cabeleireiro.count({ where }),
      CabeleireiroService.getCabeleireirosNomes(
        skip,
        limit,
        salaoId,
        nome,
      ),
    ]);

    return {
      total: total,
      page,
      limit,
      data: cabeleireiros,
    };
  };

  static findById = async (ID: string, include = false) => {
    try {
      return await prisma.cabeleireiro.findUnique({
        where: {
          ID: ID,
        },
        ...(include
          ? {
            include: {
              Salao: true,
              Agendamentos: true,
            },
          }
          : {}),
      });
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  static create = async (
    CPF: string,
    Email: string,
    Mei: string | null,
    Nome: string,
    Telefone: string,
    SalaoId: string,
    ID?: string,
  ) => {
    try {
      const data: any = {
        CPF,
        Email,
        Nome,
        Telefone,
        SalaoId,
      };
      if (ID) {
        data.ID = ID;
      }
      if (Mei) {
        data.Mei = Mei;
      }
      return await prisma.cabeleireiro.create({
        data,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  static update = async (
    CPF: string,
    Email: string,
    Mei: string | null,
    Nome: string,
    Telefone: string,
    SalaoId: string,
    ID: string,
    Status: StatusCadastro | null,
  ) => {
    try {
      const existingCabeleireiro = await CabeleireiroService.findById(ID);
      if (!existingCabeleireiro) {
        console.log("Cabeleireiro não encontrado");
        return null;
      }
      return await prisma.cabeleireiro.update({
        data: {
          CPF,
          Email,
          Nome,
          Telefone,
          SalaoId,
          Status: Status ? Status : existingCabeleireiro.Status,
          ...(Mei ? { Mei } : {}),
        },
        where: {
          ID: ID,
        },
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  static delete = async (ID: string) => {
    return await prisma.cabeleireiro.delete({
      where: {
        ID: ID,
      },
    });
  };
  static getBySalao = async (salaoID: string, includeRelations = false) => {
    try {
      return await prisma.cabeleireiro.findMany({
        where: {
          SalaoId: salaoID,
          Status: StatusCadastro.ATIVO,
        },
        ...(includeRelations
          ? {
            include: {
              Salao: true,
              Agendamentos: true,
            },
          }
          : {}),
        orderBy: {
          Nome: "asc",
        },
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}

export default CabeleireiroService;
