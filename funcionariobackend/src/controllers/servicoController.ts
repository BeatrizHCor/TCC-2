import { Request, Response } from "express";
import ServicoService from "../services/servicoService";

class ServicoController {
  static async getServicosPage(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, includeRelations, precoMin, precoMax, salaoId } = req.query;
      const servicos = await ServicoService.getServicoPage(
        Number(page),
        Number(limit),
        Number(precoMin),
        Number(precoMax),
        includeRelations === "true",
        salaoId ? String(salaoId) : null
      );
      res.json(servicos);
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: 'Erro ao buscar serviços' });
    }
  }

  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const { limit, includeRelations, salaoId } = req.query;
      const servicos = await ServicoService.getServicos(
        undefined,
        Number(limit),
        undefined,
        undefined,
        includeRelations === 'true',
        salaoId ? String(salaoId) : null
      );
      res.json(servicos);
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { Nome, PrecoMin, PrecoMax, Descricao, SalaoId } = req.body;
      const newServico = await ServicoService.create(
        Nome,
        Number(PrecoMin),
        Number(PrecoMax),
        Descricao,
        SalaoId
      );
      res.status(201).json(newServico);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao criar serviço" });
    }
  }

  static async findByID(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const includeRelations = req.query.include === "true";
      const servico = await ServicoService.findById(id, includeRelations);

      if (!servico) {
        res.status(404).json({ message: 'Serviço não encontrado' });
      } else {
        res.json(servico);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }

  static async findByNomeAndSalao(req: Request, res: Response): Promise<void> {
    try {
      const { nome, salaoId } = req.params;
      const { includeRelations } = req.query;
      const servico = await ServicoService.findByNomeAndSalao(
        nome,
        salaoId,
        includeRelations === "true"
      );
      
      if (!servico) {
        res.status(404).json({ message: 'Serviço não encontrado' });
      } else {
        res.json(servico);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedServico = await ServicoService.update(id, updateData);
      res.json(updatedServico);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao atualizar serviço" });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ServicoService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao excluir serviço" });
    }
  }

  static async getServicosBySalao(req: Request, res: Response): Promise<void> {
    try {
      const { salaoId } = req.params;
      const { includeRelations } = req.query;
      const servicos = await ServicoService.getServicosBySalao(
        salaoId,
        includeRelations === "true"
      );
      res.json(servicos);
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }
}

export default ServicoController;