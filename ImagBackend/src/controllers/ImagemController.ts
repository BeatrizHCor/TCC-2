import { Request, Response } from "express";
import { ImagemService } from "../services/ImagemService";

export class ImagemController {
  static async uploadImagePortfolio(req: Request, res: Response): Promise<void> {
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

      res.status(200).json(imagem);
    } catch (error) {
      console.error("Erro ao buscar imagem por ID:", error);
      res.status(500).json({ error: "Erro interno ao buscar imagem." });
    }
  }

  static async deleteImagem(req: Request, res: Response): Promise<void> {
    try {
      const { PortfolioId, imagemId } = req.params;
      const result = await ImagemService.deleteImagemByIdPortfolio(PortfolioId, imagemId);
      res.status(204).json(result);
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
      res.status(500).json({ error: "Erro interno ao deletar imagem." });
    }
  }
  static async updateImagem(req: Request, res: Response): Promise<void> {
    try {
      const { PortfolioId, imagemId } = req.params;
      const { Descricao } = req.body;

      const imagem = await ImagemService.updateImagemByIdPortfolio(PortfolioId, imagemId, Descricao);

      if (!imagem) {
        res.status(404).json({ error: "Imagem não encontrada." });
        return;
      }
      res.json(imagem);
    } catch (error) {
      console.error("Erro ao atualizar imagem:", error);
      res.status(500).json({ error: "Erro interno ao atualizar imagem." });
    }
  }
}
export default ImagemController;