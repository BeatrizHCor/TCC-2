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
        UsuarioID: UsuarioID,
        Email: Email,
        SalaoId: SalaoId,
        Senha: Senha,
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
        Email: Email,
        Senha: Senha,
        ...Token ? { Token } : {},
      },
      where: {
        UsuarioID: UsuarioID,
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
      UsuarioID: UsuarioID,
    },
  });
};

export const findLoginbyEmail = (Email: string, SalaoId: string) => {
  if (!Email || !SalaoId) {
    throw new Error("Email e SalaoID são obrigatórios.");
  }
  return prisma.authControl.findUnique({
    where: {
      Email_SalaoId: {        
        Email: Email,
        SalaoId: SalaoId,       
      },
    },
  });
};

export const deleteLogin = (UsuarioID: string) => {
  return prisma.authControl.delete({
    where: {
      UsuarioID,
    },
  });
}