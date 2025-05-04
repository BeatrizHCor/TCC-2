import prisma from "../config/database";
import fs from "fs";
import path from "path";


export class ImagemService {

  static async uploadImagemPortfolio(
    file: Express.Multer.File,
    portfolioId: string,
    descricao: string
  ) {
    const relativePath = path.join("uploads", file.filename);
    try {
    const imagem = await prisma.imagem.create({
      data: {
        Endereco: relativePath,
        Descricao: descricao,
        PortfolioId: portfolioId,
      },
    });
    return imagem;
    } catch (error) {
    console.error("Erro no service, upload de imagem:", error);
    throw new Error("Erro ao fazer upload da imagem.");
    }
  }

  static async getImagemPorId(id: string) {
    try {
    return await prisma.imagem.findUnique({
      where: { ID: id },
    });
    } catch (error) {
    console.error("Erro no service, imagem por ID:", error);
    throw new Error("Erro ao buscar imagem por ID.");
    }
  }

  static async getImagensPorPortfolio(portfolioId: string) {
    try {
    return await prisma.imagem.findMany({
      where: { PortfolioId: portfolioId },
    });
  } catch (error) {
    console.error("Erro no service, imagens por portfolio:", error);
    throw new Error("Erro ao buscar imagens por portfolio.");
    }
  }

}