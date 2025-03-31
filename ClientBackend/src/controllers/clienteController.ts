import { Request, Response } from 'express';
import ClienteService from '../services/clienteService';

class ClienteController {
  static async findAll(req: Request, res: Response) {
    try {
      const { page, limit, includeRelations } = req.query;
      const clientes = await ClienteService.getClientePage(
        Number(page), 
        Number(limit), 
        includeRelations === 'true'
      );
      res.json(clientes);
    } catch (error) {
      this.handleError(res, error);
    }
  }


  static async create(req: Request, res: Response) {
    try {
      const clienteData = req.body;
      const newCliente = await ClienteService.create(clienteData);
      res.status(201).json(newCliente);
    } catch (error) {
      this.handleError(res, error);
    }
  }

 
  static async findByCPFandSalao(req: Request, res: Response) {
    try {
      const { cpf, salaoId } = req.params;
      const { includeRelations } = req.query;
      const cliente = await ClienteService.findByEmailandSalao(
        cpf, 
        salaoId, 
        includeRelations === 'true'
      );
      res.json(cliente);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  
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

  static async delete(req: Request, res: Response) {
    try {
      const { cpf, salaoId } = req.params;
      await ClienteService.delete(cpf, salaoId);
      res.status(204).send();
    } catch (error) {
      this.handleError(res, error);
    }
  }

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