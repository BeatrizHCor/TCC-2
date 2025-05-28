import { response } from "express";
import prisma from "../config/database";
import fs from "fs";
import path from "path";


export class ImagemService {

  static async uploadImagemPortfolio(
    file: Express.Multer.File,
    portfolioId: string,
    descricao: string
  ) 
  
  {  if (!file || !file.filename) {
    throw new Error('Arquivo inválido ou não foi recebido corretamente');
  }
    const relativePath = path.join("uploads", file.filename);
    try {
      
    const imagem = await prisma.imagem.create({
      data: {
        PortfolioId: portfolioId,
        Endereco: relativePath,
        Descricao: descricao,
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

      let fotos = await prisma.imagem.findMany({
        where: { PortfolioId: portfolioId },
      });

      const fotosComConteudo = fotos.map((foto: { Endereco: string; }) => {
        try {
          const filePath = path.normalize(path.join(__dirname, "..", "..", foto.Endereco));
          if (fs.existsSync(filePath)) {
            const fileStat = fs.statSync(filePath);
            const fileSizeInBytes = fileStat.size;
            const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
            const fileContent = fs.readFileSync(filePath, { encoding: "base64" });
            return { ...foto, fileSize: fileSizeInMB, fileContent };
          }

          return { ...foto, fileSize: null, fileContent: null };
        } catch (err) {
          console.error(`Erro ao processar arquivo ${foto.Endereco}:`, err);
          return { ...foto, fileSize: null, fileContent: null };
        }
      });
  
      return fotosComConteudo;
    } catch (error) {
      console.error("Erro ao buscar imagens do portfólio:", error);
      throw new Error("Falha ao recuperar imagens do portfólio");
    }
  }

  static async deleteImagemPorId(portfolioId: string, imagemId: string) {
    try {
      const imagens = await prisma.imagem.findMany({
        where: { PortfolioId: portfolioId },
      });
      if (!imagens || imagens.length === 0) {
        throw new Error("Nenhuma imagem encontrada para o portfólio informado.");
      }

      const imagemParaDeletar = imagens.find(img => img.ID === imagemId);
      if (!imagemParaDeletar) {
        throw new Error("Imagem não encontrada para o portfólio informado.");
      }

      const filePath = path.normalize(path.join(__dirname, "..", "..", imagemParaDeletar.Endereco));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await prisma.imagem.delete({
        where: { ID: imagemId },
      });

     return { success: true, message: "Imagem deletada com sucesso." };
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
      throw new Error("Falha ao deletar imagem do portfólio.");
    }
  }
}