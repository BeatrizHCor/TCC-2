import { Request, Response } from "express";
import CabeleireiroService from "../services/CabeleireiroService";

class CabeleireiroController {
  static findAllPaginated = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { page, limit, includeRelations, salaoId } = req.query;
      const { nome = "" } = req.query;
      const cabeleireiros = await CabeleireiroService.getCabeleireiroPage(
        Number(page),
        Number(limit),
        includeRelations === "true",
        salaoId ? String(salaoId) : null,
        nome ? String(nome) : null,
      );
      res.status(200).json(cabeleireiros);
    } catch (error) {
      console.log(error);
      res.status(204).json({ message: "Cabeleireiro não encontrado" });
    }
  };
  static findAllNamesPaginated = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { page, limit, salaoId } = req.query;
      const { nome = "" } = req.query;
      const cabeleireiros = await CabeleireiroService.getCabeleireiroNomePage(
        Number(page),
        Number(limit),
        salaoId ? String(salaoId) : null,
        nome ? String(nome) : null,
      );
      res.status(200).json(cabeleireiros);
    } catch (error) {
      console.log(error);
      res.status(204).json({ message: "Cabeleireiro não encontrado" });
    }
  };
  static findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const includeRelations = req.query.include === "true";
      const cabeleireiro = await CabeleireiroService.findById(
        id,
        includeRelations,
      );
      if (!cabeleireiro) {
        res.status(204).json({ message: "Cabeleireiro não encontrado" });
      } else {
        res.json(cabeleireiro);
      }
    } catch (e) {
      console.log(e);
      res.status(204).json({ message: "Cabeleireiro não encontrado" });
    }
  };
  static create = async (req: Request, res: Response): Promise<void> => {
    try {
      let { Email, CPF, Telefone, SalaoId, Mei, Nome, ID } = req.body;
      if (!Mei) {
        Mei = null;
      }
      if (!ID) {
        ID = null;
      }
      const cabeleireiro = await CabeleireiroService.create(
        CPF,
        Email,
        Mei,
        Nome,
        Telefone,
        SalaoId,
        ID,
      );
      if (!cabeleireiro || cabeleireiro === null) {
        res
          .status(404)
          .json({ message: "Cabeleireiro não pode ser registrado" });
      } else {
        res.status(201).json(cabeleireiro);
      }
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Não foi possivél criar o Cabeleireiro" });
    }
  };
  static update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { Email, CPF, Telefone, SalaoId, Mei, Nome, ID, Status } = req.body;
      console.log("atualizando cabeleireiro");
      const cabeleireiro = await CabeleireiroService.update(
        CPF,
        Email,
        Mei,
        Nome,
        Telefone,
        SalaoId,
        ID,
        Status ? Status : Status.ATIVO,
      );
      if (!cabeleireiro) {
        res
          .status(404)
          .json({ message: "Cabeleireiro não pode ser registrado" });
      } else {
        res.status(200).json(cabeleireiro);
      }
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Não foi possivél criar o Cabeleireiro" });
    }
  };

  static delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const existingCabeleireiro = await CabeleireiroService.findById(id);
      if (!existingCabeleireiro) {
        res.status(404).json({ message: "Cabeleireiro não encontrado." });
        return;
      } else {
        const cabeleireiro = await CabeleireiroService.delete(id);
        if (!cabeleireiro) {
          throw new Error("Erro ao excluir cabeleireiro.");
        } else {
          res.status(200).json(cabeleireiro);
        }
      }
    } catch (error) {
      console.log(error);
      if (
        (error instanceof Error && error.message.includes("constraint")) ||
        (typeof error === "object" &&
          error !== null &&
          "code" in error &&
          (error as any).code === "P2003")
      ) {
        res.status(409).json({
          message: "Não é possível excluir: cabeleireiro está em uso.",
        });
      } else {
        res.status(500).json({
          message: error instanceof Error
            ? error.message
            : "Erro ao excluir cabeleireiro",
        });
      }
    }
  };

  static getBySalao = async (req: Request, res: Response): Promise<void> => {
    try {
      const { salaoId } = req.params;
      const includeRelations = req.query.includeRelations === "true";
      if (!salaoId) {
        res.status(400).json({ message: "SalaoId do salão não informado" });
      } else {
        const cabeleireiros = await CabeleireiroService.getBySalao(
          salaoId,
          includeRelations,
        );
        if (!cabeleireiros || cabeleireiros.length === 0) {
          res.status(204).json({
            message: "Nenhum cabeleireiro encontrado para este salão",
          });
        } else {
          res.status(200).json(cabeleireiros);
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Erro ao buscar cabeleireiros do salão",
      });
    }
  };
}
export default CabeleireiroController;
