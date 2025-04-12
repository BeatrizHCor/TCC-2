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
      res.status(404).json({ message: "Cliente não encontrado" });
    }
  };
}

export default CabeleireiroController;
