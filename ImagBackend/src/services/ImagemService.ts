import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import fs from "fs";
import path from "path";


export class ImagemService {
  static async uploadImagem(
    file: Express.Multer.File,
    portfolioId: string,
    descricao: string
  ) {
    const relativePath = path.join("uploads", file.filename);

    const imagem = await prisma.imagem.create({
      data: {
        Endereco: relativePath,
        Descricao: descricao,
        PortfolioId: portfolioId,
      },
    });

    return imagem;
  }

  static async getImagemPorId(id: string) {
    return await prisma.imagem.findUnique({
      where: { ID: id },
    });
  }

  static async getImagensPorPortfolio(portfolioId: string) {
    return await prisma.imagem.findMany({
      where: { PortfolioId: portfolioId },
    });
  }
}
