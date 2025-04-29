import { Router, Request, Response } from "express";
import { getFuncionarioPage,
    postFuncionario,
    getServicoPage, 
    deleteFuncionario} from "../services/ServiceFunc";
import { postLogin, registerLogin } from "../services/Service";


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

RoutesFuncionario.post(
    "/funcionario",
    async (req: Request, res: Response) => {
        let { CPF, Nome, Email, Telefone, SalaoId, Auxiliar, Salario, Password, userType } = req.body;
        try {
        let funcionario = await postFuncionario(
            CPF,
            Nome,
            Email,
            Telefone,
            SalaoId,
            Auxiliar,
            Salario
        );
        let register = await registerLogin(
            userType,
            funcionario.id!,
            Email,
            Password,
            SalaoId
            );
        if (!register) {
            console.log("Register failed");
            let funcionarioDelete = await deleteFuncionario(funcionario.id!);
        if (funcionarioDelete) {
            console.log("Funcionario deleted successfully");
            } else {
            console.log("Failed to delete funcionario after register failure");
            }
            throw new Error("Login registration failed");
            }
            let token = await postLogin(Email, Password, SalaoId);
            res.status(200).send(token);
        } catch (e) {
            console.log(e);
            res.status(500).send("Error in creating customer");
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