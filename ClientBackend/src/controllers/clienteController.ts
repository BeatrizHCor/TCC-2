import { Request, Response } from 'express';
import ClienteService from '../services/clienteService';

class ClienteController {
  // Buscar todos os clientes
  static async findAll(req: Request, res: Response) {
    try {
      const { page, limit, includeRelations } = req.query;
      const clientes = await ClienteService.findAll(
        Number(page), 
        Number(limit), 
        includeRelations === 'true'
      );
      res.json(clientes);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Criar novo cliente
  static async create(req: Request, res: Response) {
    try {
      const clienteData = req.body;
      const newCliente = await ClienteService.create(clienteData);
      res.status(201).json(newCliente);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Buscar cliente por CPF e Salão
  static async findByCPFandSalao(req: Request, res: Response) {
    try {
      const { cpf, salaoId } = req.params;
      const { includeRelations } = req.query;
      const cliente = await ClienteService.findByCPFandSalao(
        cpf, 
        salaoId, 
        includeRelations === 'true'
      );
      res.json(cliente);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Atualizar cliente
  static async update(req: Request, res: Response) {
    try {
      const { cpf, salaoId } = req.params;
      const updateData = req.body;
      const updatedCliente = await ClienteService.update(cpf, salaoId, updateData);
      res.json(updatedCliente);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Deletar cliente
  static async delete(req: Request, res: Response) {
    try {
      const { cpf, salaoId } = req.params;
      await ClienteService.delete(cpf, salaoId);
      res.status(204).send();
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Método auxiliar para tratamento de erros
  private static handleError(res: Response, error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    res.status(500).json({ 
      error: 'Erro interno do servidor', 
      details: errorMessage 
    });
  }
}

export default ClienteController;