import { Request, Response } from "express";
import FuncionarioService from "../services/funcinarioService";

class FuncionarioController {

  static async getFuncionariosPage(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, includeRelations, salaoId } = req.query;
      const nome = req.query.nome ? String(req.query.nome) : null;
      const funcionarios = await FuncionarioService.getFuncionarioPage(
        page ? Number(page): 1,
        limit ? Number(limit): 10,
        nome ? String(nome) : null,
        includeRelations === "true",
        salaoId ? String(salaoId) : null
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
        Number(limit),
        nome ? String(nome) : null,
        includeRelations === 'true',
        salaoId ? String(salaoId) : null
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
      const newFuncionario = await FuncionarioService.create(
        CPF,
        Nome,
        Email,
        Telefone,
        SalaoId,
        Auxiliar,
        Salario
      );
      res.status(201).json(newFuncionario);
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
      const funcionarioDeletado = await FuncionarioService.deleteById(id);
      res.status(200).json(funcionarioDeletado);
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }
}

export default FuncionarioController;