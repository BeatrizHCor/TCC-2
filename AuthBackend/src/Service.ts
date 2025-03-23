import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createLogin = async (
  SalaoId: string,
  UsuarioID: string,
  Senha: string,
  Email: string
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
