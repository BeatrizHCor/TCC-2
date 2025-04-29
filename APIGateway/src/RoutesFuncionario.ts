import { Router, Request, Response } from "express";
import { getFuncionarioPage,
    getServicoPage } from "./Service";


const RoutesFuncionario = Router();

RoutesFuncionario.get(
    "/funcionario/page", 
    async (req: Request, res: Response) => {
        const page = (req.query.page as string) || '0';
        const limit = (req.query.limit as string) || '10';
        const includeRelations = req.query.include === "true" ? true : false;
        const salaoId = req.query.salaoId as string || '';
         try {
            const funcionarios = await getFuncionarioPage(page, limit, includeRelations, salaoId);
            res.json(funcionarios);
        } catch (error) {
          console.error("Erro ao buscar funcionarios:", error);
          res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
);

RoutesFuncionario.get(
    "/servico/page",
    async (req: Request, res: Response) => {
        const page = (req.query.page as string) || '0';
        const limit = (req.query.limit as string) || '10';
        const precoMin: number | null = null;
        const precoMax: number | null = null;
        const includeRelations = req.query.include === "true" ? true : false;
        const salaoId = req.query.salaoId as string || '';
         try {
            const funcionarios = await getServicoPage(page, limit, precoMin, precoMax, includeRelations, salaoId);
            res.json(funcionarios);
        } catch (error) {
          console.error("Erro ao buscar funcionarios:", error);
          res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
);

export default RoutesFuncionario;