import { Request, Response } from "express";
import ServicoService from "../services/servicoService";

class ServicoController {
  static async getServicosPage(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, salaoId, nome, precoMin, precoMax, includeRelations } = req.query;
      const servicos = await ServicoService.getServicoPage(
        !isNaN(Number(page)) ? Number(page): 1,
        !isNaN(Number(limit)) ? Number(limit): 10,
        nome ? String(nome) : "",
        !isNaN(Number(precoMin)) ? Number(precoMin) : 0,
        !isNaN(Number(precoMax)) ? Number(precoMax) : 0,
        includeRelations === "true",
        salaoId ? String(salaoId) : ""
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
        null,
        !isNaN(Number(limit)) ? Number(limit): 10,
        "",
        0,
        0,
        includeRelations === 'true',
        salaoId ? String(salaoId) : ""
      );
      res.json(servicos);
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }

static async create(req: Request, res: Response): Promise<void> {
  try {
    const {Nome, PrecoMin, PrecoMax, Descricao, SalaoId} = req.body;

    if (!Nome || PrecoMin === undefined || !isNaN(Number(PrecoMin)) || PrecoMax === undefined || !isNaN(Number(PrecoMax)) || !SalaoId) {
      res.status(400).json({ message: "Campos obrigatórios ausentes." });
    } else {
    if (PrecoMin > PrecoMax) {
      res.status(422).json({ message: "Preço mínimo não pode ser maior que o preço máximo." });
    } else {
    const newServico = await ServicoService.create(
      Nome,
      Number(PrecoMin),
      Number(PrecoMax),
      Descricao,
      SalaoId
    );
    res.status(201).json(newServico);
  }}
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message.includes("unique constraint")) {
    res.status(409).json({ message: "Já existe um serviço com esse nome para este salão." });
    } else {
    res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao criar serviço" });
    }
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


static async update(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { Nome, PrecoMin, PrecoMax, Descricao, SalaoId } = req.body;

    if (!Nome || PrecoMin === undefined || !isNaN(Number(PrecoMin)) || PrecoMax === undefined || !isNaN(Number(PrecoMax)) || !SalaoId) {
       res.status(400).json({ message: "Campos obrigatórios ausentes." });
    } else {
      const existingServico = await ServicoService.findById(id);
      if (!existingServico) {
        res.status(404).json({ message: "Serviço não encontrado." });
      } else if (PrecoMin > PrecoMax) {
        res.status(422).json({ message: "Preço mínimo não pode ser maior que o preço máximo." });
      } else {
      const updatedServico = await ServicoService.update(
        id,
        Nome,
        Number(PrecoMin),
        Number(PrecoMax),
        Descricao,
        SalaoId
      );
      res.json(updatedServico);
      }
    } 
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message.includes("unique constraint")) {
     res.status(409).json({ message: "Já existe um serviço com esse nome para este salão." });
    }

    res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao atualizar serviço" });
  }
}

static async delete(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const existingServico = await ServicoService.findById(id);

    if (!existingServico) {
      res.status(404).json({ message: "Serviço não encontrado." });
    } else {
      const servicoDeletado = await ServicoService.delete(id);

      if (!servicoDeletado) {
        throw new Error("Erro ao excluir serviço.");
      } else {
        res.status(200).json(servicoDeletado);
      }
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message.includes("constraint")) {
    res.status(409).json({ message: "Não é possível excluir: serviço está em uso." });
    } else {
    res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao excluir serviço" });
    }
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

  static async findServicoByNomeAndSalaoId(req: Request, res: Response): Promise<void> {
    try {
      const { Nome, SalaoId } = req.params;
      const servico  = await ServicoService.findServicoByNomeAndSalaoId(Nome, SalaoId);
      res.json(servico);
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }
}

export default ServicoController;