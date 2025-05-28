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


  static async deleteImagemByIdPortfolio(portfolioId: string, imagemId: string) {
      try {
        const imagemParaDeletar = await prisma.imagem.findFirst({
          where: { 
            ID: imagemId,
            PortfolioId: portfolioId 
          },
        });
        if (!imagemParaDeletar) {
          throw new Error("Imagem não encontrada para o portfólio informado.");
        }

        const filePath = path.normalize(path.join(__dirname, "..", "..", imagemParaDeletar.Endereco));
        const expectedDir = path.normalize(path.join(__dirname, "..", "..")); // check para garantir que não haja deletes fora da pasta
        if (!filePath.startsWith(expectedDir)) {
          throw new Error("Invalid file path detected.");
        }
        
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
  static async updateImagemByIdPortfolio(portfolioId: string, imagemId: string, descricao: string) {
    try{
      const resultado = await prisma.imagem.update({
        where: { 
          ID: imagemId,
          PortfolioId: portfolioId 
        },
        data: { Descricao: descricao },
      });
      if (!resultado) {
        console.log("Imagem não encontrada ou não pertence ao portfólio informado.");
        return null;
      }
      return resultado;
    } catch (error) {
      console.error("Erro ao atualizar imagem:", error);
      throw new Error("Falha ao atualizar imagem do portfólio.");
    }
  }
}
