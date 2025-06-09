import { Request, Response } from "express";
import ClienteService from "../services/ClienteService";

class ClienteController {
  static async getClientesPage(req: Request, res: Response): Promise<void> {
    try {
      const {
        page,
        limit,
        salaoId,
        termoBusca,
        campoBusca,
        dataFilter,
        includeRelations,
      } = req.query;
      const clientes = await ClienteService.getClientePage(
        !isNaN(Number(page)) ? Number(page) : 1,
        !isNaN(Number(limit)) ? Number(limit) : 10,
        salaoId ? String(salaoId) : "",
        includeRelations === "true",
        termoBusca ? String(termoBusca) : "",
        campoBusca ? String(campoBusca) : "",
        dataFilter ? String(dataFilter) : "",
      );
      res.status(200).json(clientes);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao buscar clientes" });
    }
  }

  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const { limit, includeRelations, salaoId } = req.query;
      const clientes = await ClienteService.getClientes(
        null,
        !isNaN(Number(limit)) ? Number(limit) : 10,
        includeRelations === "true",
        salaoId ? String(salaoId) : null,
        "",
        "",
        "",
      );
      res.status(200).json(clientes);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao buscar clientes" });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      let { CPF, Nome, Email, Telefone, SalaoId } = req.body;

      if (!CPF || !Nome || !Email || !Telefone || !SalaoId) {
        res.status(400).json({
          message: "Todos os campos obrigatórios devem ser informados.",
        });
      } else {
        const existingCliente = await ClienteService.findByEmailandSalao(
          Email,
          SalaoId,
          false,
        );
        if (existingCliente) {
          res.status(409).json({
            message: "Já existe um cliente com este email para este salão.",
          });
        } else {
          const newCliente = await ClienteService.create(
            CPF,
            Nome,
            Email,
            Telefone,
            SalaoId,
          );
          res.status(201).json(newCliente);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }
  static async findByID(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const includeRelations = req.query.include === "true" ? true : false;
      if (!id) {
        res.status(400).json({ message: "Dados do cliente não informado." });
      } else {
        const cliente = await ClienteService.findById(id, includeRelations);
        if (!cliente) {
          res.status(204).json({ message: "Cliente não encontrado" });
        } else {
          res.status(200).json(cliente);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }

  static async findByEmailandSalao(req: Request, res: Response) {
    try {
      const { email, salaoId } = req.params;
      const includeRelations = req.query.include === "true" ? true : false;
      if (!email || !salaoId) {
        return res.status(400).json({
          message: "Email e SalaoId são obrigatórios.",
        });
      } else {
        const cliente = await ClienteService.findByEmailandSalao(
          email,
          salaoId,
          includeRelations,
        );

        if (!cliente) {
          return res.status(404).json({ message: "Cliente não encontrado" });
        } else {
          res.status(200).json(cliente);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar cliente por email e salão");
    }
  }

  static async findByCpfandSalao(req: Request, res: Response): Promise<void> {
    try {
      const { cpf, salaoId } = req.params;
      const { includeRelations } = req.query;
      if (!cpf || !salaoId) {
        res.status(400).json({ message: "CPF e SalaoId são obrigatórios." });
      } else {
        const cliente = await ClienteService.findByCpfandSalao(
          cpf,
          salaoId,
          includeRelations === "true",
        );
        if (!cliente) {
          res.status(204).json({ message: "Cliente não encontrado" });
        } else {
          res.status(200).json(cliente);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao buscar cliente por CPF e salão");
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id || !updateData || Object.keys(updateData).length === 0) {
        res.status(400).json({ message: "Dados do cliente não informado." });
      } else {
        const existingCliente = await ClienteService.findById(id);
        if (!existingCliente) {
          res.status(404).json({ message: "Cliente não encontrado." });
        } else {
          const updatedCliente = await ClienteService.update(id, updateData);
          if (!updatedCliente) {
            throw new Error("Erro ao atualizar cliente");
          }
          res.status(200).json(updatedCliente);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao atualizar cliente");
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Dados do cliente não informado." });
      } else {
        let clienteDeletar = await ClienteService.findById(id);
        if (!clienteDeletar) {
          res.status(404).json({ message: "Cliente não encontrado" });
        } else {
          await ClienteService.delete(id);
          res.status(204).send();
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  }
}

export default ClienteController;
