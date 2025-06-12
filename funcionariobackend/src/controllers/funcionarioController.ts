import { Request, Response } from "express";
import FuncionarioService from "../services/funcinarioService";

class FuncionarioController {

  static async getFuncionariosPage(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, includeRelations, salaoId } = req.query;
      const nome = req.query.nome ? String(req.query.nome) : null;
      const funcionarios = await FuncionarioService.getFuncionarioPage(
        !isNaN(Number(page)) ? Number(page): 1,
        !isNaN(Number(limit)) ? Number(limit): 10,
        nome ? String(nome) : null,
        includeRelations === "true",
        salaoId ? String(salaoId) : ""
      );
      res.json(funcionarios);
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: 'Funcionário não encontrado' });
    }
  }

  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const { limit, nome, includeRelations, salaoId } = req.query;
      const funcionarios = await FuncionarioService.getFuncionarios(
        null,
        !isNaN(Number(limit)) ? Number(limit): 10,
        nome ? String(nome) : null,
        includeRelations === 'true',
        salaoId ? String(salaoId) : ""
      );
      res.json(funcionarios);
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      let { CPF, Nome, Email, Telefone, SalaoId, Auxiliar, Salario } = req.body;
      const existingFuncionario = await FuncionarioService.findByEmailandSalao(Email, SalaoId);
      if (existingFuncionario) {
        res.status(409).send(`Cliente com o email ${Email} já cadastrado no salao`);    
      } else {
      const newFuncionario = await FuncionarioService.create(
        CPF,
        Nome,
        Email,
        Telefone,
        SalaoId,
        Auxiliar,
        Salario
      );
      res.status(201).json(newFuncionario);}
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }

  static async findByID(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const includeRelations = req.query.include === "true";
      const funcionario = await FuncionarioService.findById(id, includeRelations);

      if (!funcionario) {
        res.status(204).json({ message: 'Funcionário não encontrado' });
      } else {
        res.json(funcionario);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }

  static async findByEmailandSalao(req: Request, res: Response) {
    try {
      const { email, salaoId } = req.params;
      const { includeRelations } = req.query;
      const funcionario = await FuncionarioService.findByEmailandSalao(
        email,
        salaoId,
        includeRelations === "true"
      );
      if (!funcionario) {
        res.status(204).json({ message: "Funcionário não encontrado" });
      } else {
        res.json(funcionario);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }

  static async findByCpfandSalao(req: Request, res: Response): Promise<void> {
    try {
      const { cpf, salaoId } = req.params;
      const { includeRelations } = req.query;
      const funcionario = await FuncionarioService.findByCpfandSalao(
        cpf,
        salaoId,
        includeRelations === "true"
      );
      if (!funcionario) {
        res.status(204).json({ message: "Funcionário não encontrado" });
      } else {
        res.json(funcionario);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }
  
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {        
        Nome,
        CPF,
        Email,
        Telefone,
        SalaoId,
        Auxiliar,
        Salario} = req.body;
      const updatedFuncionario = await FuncionarioService.update(
        id,
        Nome,
        CPF,
        Email,
        Telefone,
        SalaoId,
        Auxiliar,
        Salario
      );
      res.json(updatedFuncionario);
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }

static async delete(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const existingFuncionario = await FuncionarioService.findById(id);

    if (!existingFuncionario) {
      res.status(404).json({ message: "Funcionário não encontrado." });
    } else {
      const funcionarioDeletado = await FuncionarioService.deleteById(id);

      if (!funcionarioDeletado) {
        throw new Error("Erro ao excluir funcionário.");
      } else {
        res.status(200).json(funcionarioDeletado);
      }
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message.includes("constraint")) {
      res.status(409).json({ message: "Não é possível excluir: funcionário está em uso." });
    } else {
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao excluir funcionário" });
    }
  }
}
}

export default FuncionarioController;