import { PrismaClient, userTypes } from "@prisma/client";
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
        Type: userType as userTypes,
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
    return await prisma.authControl.update({
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
