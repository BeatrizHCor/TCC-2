import { Request, Response } from "express";
import FuncionarioService from "../services/funcinarioService";

class FuncionarioController {

  static async getFuncionariosPage(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, includeRelations, salaoId } = req.query;
      const funcionarios = await FuncionarioService.getFuncionarioPage(
        Number(page),
        Number(limit),
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
      const { limit, includeRelations, salaoId } = req.query;
      const funcionarios = await FuncionarioService.getFuncionarios(
        null,
        Number(limit),
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
      const includeRelations = req.query.include === "true"; // Converte include para booleano
      const funcionario = await FuncionarioService.findById(id, includeRelations);

      if (!funcionario) {
        res.status(404).json({ message: 'Funcionário não encontrado' });
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
        res.status(404).json({ message: 'Funcionário não encontrado' });
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
      res.json(funcionario);
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }
  
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { email, salaoId } = req.params;
      const updateData = req.body;
      const updatedFuncionario = await FuncionarioService.update(
        email,
        salaoId,
        updateData
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
      await FuncionarioService.deleteById(id);
      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }
}

export default FuncionarioController;