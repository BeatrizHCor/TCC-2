import { Request, Response } from "express";
import { ImagemService } from "../services/ImagemService";

export class ImagemController {
  static async uploadPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const { PortfolioId, Descricao } = req.body;

      if (!req.file) {
        res.status(400).json({ error: "Nenhum arquivo enviado." });
      }
      console.log('Arquivo recebido controler:', req.file);
      const imagem = await ImagemService.uploadImagemPortfolio(
        req.file!,
        PortfolioId,
        Descricao
      );

      res.status(201).json(imagem);
    } catch (error) {
      if (!res.headersSent) {
      console.error("Erro ao fazer upload:", error);
      res.status(500).json({ error: "Erro interno ao salvar imagem." });
    }
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const imagem = await ImagemService.getImagemPorId(id);

      if (!imagem) {
         res.status(404).json({ error: "Imagem não encontrada." });
      }

      res.json(imagem);
    } catch (error) {
      console.error("Erro ao buscar imagem por ID:", error);
      res.status(500).json({ error: "Erro interno ao buscar imagem." });
    }
  }

  static async getByPortfolio(req: Request, res: Response) {
    try {
      const { PortfolioId } = req.params;
      const imagens = await ImagemService.getImagensPorPortfolio(PortfolioId);

      res.json(imagens);
    } catch (error) {
      console.error("Erro ao buscar imagens por portfolio:", error);
      res.status(500).json({ error: "Erro interno ao buscar imagens." });
    }
  }
}
export default ImagemController;