import { Request, Response } from 'express';
import ClienteService from '../services/clienteService';

class ClienteController {
  static async getClientesPage(req: Request, res: Response) {
    try {
      const { page, limit, includeRelations, salaoId } = req.query;
      const clientes = await ClienteService.getClientePage(
        Number(page), 
        Number(limit), 
        includeRelations === 'true',
        salaoId ? String(salaoId) : null
      );
      res.json(clientes);
    } catch (error) {
      this.handleError(res, error);
    }
  }

    static async findAll(req: Request, res: Response) {
      try {
        const { limit, includeRelations, salaoId } = req.query;
        const clientes = await ClienteService.getClientes(
          null,
          Number(limit),
          includeRelations === 'true',
          salaoId ? String(salaoId) : null
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

  static async findByID (req: Request, res: Response) {
    try {
      const { id } = req.params; // ID do cliente
      const includeRelations = req.query.include === 'true'; // Converte include para booleano
      const cliente = await ClienteService.findById(id, includeRelations);
    
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
      return res.json(cliente);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  static async findByEmailandSalao(req: Request, res: Response) {
    try {
      const { email, salaoId } = req.params;
      const { includeRelations } = req.query;
      const cliente = await ClienteService.findByEmailandSalao(
        email, 
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
      const { email, salaoId } = req.params;
      const updateData = req.body;
      const updatedCliente = await ClienteService.update(email, salaoId, updateData);
      res.json(updatedCliente);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { email, salaoId } = req.params;
      await ClienteService.delete(email, salaoId);
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