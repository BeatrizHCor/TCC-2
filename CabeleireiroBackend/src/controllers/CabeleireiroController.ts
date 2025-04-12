import { Request, Response } from "express";
import CabeleireiroService from "../services/CabeleireiroService";

class CabeleireiroController {
  static findAllPaginated = async (req: Request, res: Response) => {
    try {
      const { page, limit, includeRelations, salaoId } = req.query;
      const cabeleireiros = await CabeleireiroService.getCabeleireiroPage(
        Number(page),
        Number(limit),
        includeRelations === "true",
        salaoId ? String(salaoId) : null
      );
      res.json(cabeleireiros);
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "Cabeleireiro não encontrado" });
    }
  };

  static findById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const includeRelations = req.query.include === "true"; // Converte include para booleano
      const cabeleireiro = await CabeleireiroService.findById(
        id,
        includeRelations
      );
      if (!cabeleireiro) {
        res.status(404).json({ message: "Cabeleireiro não encontrado" });
      } else {
        res.json(cabeleireiro);
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "Cabeleireiro não encontrado" });
    }
  };
}

export default CabeleireiroController;
