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
      // Buscar imagens do portfólio
      let fotos = await prisma.imagem.findMany({
        where: { PortfolioId: portfolioId },
      });
  
      // Mapear as imagens para adicionar informações de tamanho do arquivo e o conteúdo do arquivo
      const fotosComConteudo = fotos.map((foto: { Endereco: string; }) => {
        try {
          const filePath = path.normalize(path.join(__dirname, "..", "..", foto.Endereco));
          if (fs.existsSync(filePath)) {
            const fileStat = fs.statSync(filePath);
            const fileSizeInBytes = fileStat.size;
            const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convertendo para MB
            const fileContent = fs.readFileSync(filePath, { encoding: "base64" }); // Ler o arquivo como Base64
            return { ...foto, fileSize: fileSizeInMB, fileContent };
          }
          // Se o arquivo não existir, retornar a foto sem o conteúdo
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

}