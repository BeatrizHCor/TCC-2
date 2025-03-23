import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createLogin = async (
  SalaoId: string,
  UsuarioID: string,
  Senha: string,
  Email: string,
  userType: string
) => {
  try {
    await prisma.authControl.create({
      data: {
        SalaoId,
        Email,
        Senha,
        UsuarioID,
      },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const updateLogin = async (
  UsuarioID: string,
  Senha: string,
  Email: string,
  SalaoId: string,
  Token?: string
) => {
  try {
    await prisma.authControl.update({
      data: {
        Email,
        Senha,
        Token,
      },
      where: {
        Email_SalaoId: {
          Email,
          SalaoId,
        },
      },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const findLoginbyUserId = (UsuarioID: string) => {
  return prisma.authControl.findUnique({
    where: {
      UsuarioID,
    },
  });
};

export const findLoginbyEmail = (Email: string, SalaoId: string) => {
  return prisma.authControl.findUnique({
    where: {
      Email_SalaoId: {
        Email,
        SalaoId,
      },
    },
  });
};
