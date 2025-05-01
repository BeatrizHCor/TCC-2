import { Router, Request, Response } from "express";
import { getFuncionarioPage,
    postFuncionario,
    getServicoPage, 
    deleteFuncionario,
    postServico,
    deleteServico,
    updateServico,
    getServicoById, 
    getServicosBySalao,
    getServicoByNomeAndSalao,
    findServicoByNomeAndSalaoId} from "../services/ServiceFunc";
import { postLogin, registerLogin } from "../services/Service";


const RoutesFuncionario = Router();

RoutesFuncionario.get(
    "/funcionario/page", 
    async (req: Request, res: Response) => {
        const page = (req.query.page as string) || '0';
        const limit = (req.query.limit as string) || '10';
        const nome = req.query.nome as string || null;
        const includeRelations = req.query.include === "true" ? true : false;
        const salaoId = req.query.salaoId as string || '';
         try {
            const funcionarios = await getFuncionarioPage(page, limit, nome, includeRelations, salaoId);
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

RoutesFuncionario.delete(
    "/funcionario/delete/:id",
    async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            let funcionarioDelete = await deleteFuncionario(id);
            if (funcionarioDelete) {
                res.status(200).send(funcionarioDelete);
            } else {
                res.status(404).send("Funcionario not found");
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Error in deleting Funcionario");
        }
    }
);

RoutesFuncionario.get(
    "/servico/page",
    async (req: Request, res: Response) => {
        const page = (req.query.page as string) || '0';
        const limit = (req.query.limit as string) || '10';
        const nome = req.query.nome as string || null;
        const precoMin: number | null = null;
        const precoMax: number | null = null;
        const includeRelations = req.query.include === "true" ? true : false;
        const salaoId = req.query.salaoId as string || '';
         try {
            const funcionarios = await getServicoPage(page, limit, nome, precoMin, precoMax, includeRelations, salaoId);
            res.json(funcionarios);
        } catch (error) {
          console.error("Erro ao buscar funcionarios:", error);
          res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
);

RoutesFuncionario.post(
    "/servico",
    async (req: Request, res: Response) => {
        let ServicoData = req.body;
        try {           
            let servico = await postServico(ServicoData);
            res.status(200).send(servico);
        } catch (e) {
            console.log(e);
            res.status(500).send("Error in creating customer");
        }
    }
);

RoutesFuncionario.delete(
    "/servico/delete/:id",
    async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            let servicoDelete = await deleteServico(id);
            if (servicoDelete) {
                res.status(200).send(servicoDelete);
            } else {
                res.status(404).send("Servico not found");
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Error in deleting Funcionario");
        }
    }
);

RoutesFuncionario.put(
    "/servico/update/:id",
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const servicoData = req.body;
        try {
            let servicoUpdate = await updateServico(id, servicoData);
            if (servicoUpdate) {
                res.status(200).send(servicoUpdate);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Error in updating Funcionario");
        }
    }
);

RoutesFuncionario.get(
    "/servico/ID/:id",
    async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            let servico = await getServicoById(id);
            if (servico) {
                res.status(200).send(servico);
            } else {
                res.status(404).send("Servico not found");
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Error in getting Funcionario");
        }
    }
);

RoutesFuncionario.get(
    "/servico/salao/:salaoId",
    async (req: Request, res: Response) => {
        const { salaoId } = req.params;
        try {
            let servico = await getServicosBySalao(salaoId);
            if (servico) {
                res.status(200).send(servico);
            } else {
                res.status(404).send("Servico not found");
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Error in getting Funcionario");
        }
    }
);

RoutesFuncionario.get(
    "/servico/nome/:nome/:salaoId",
    async (req: Request, res: Response) => {
        const { nome, salaoId } = req.params;
        try {
            let servico = await getServicoByNomeAndSalao(nome, salaoId);
            if (servico) {
                res.status(200).send(servico);
            } else {
                res.status(404).send("Servico not found");
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Error in getting Servicos");
        }
    }
);

RoutesFuncionario.get(
    "/servico/find/:nome/:salaoId",
    async (req: Request, res: Response) => {
        const { nome, salaoId } = req.params;
        try {
            let servico = await findServicoByNomeAndSalaoId(nome, salaoId);
            if (servico) {
                res.status(200).send(servico);
            } else {
                res.status(404).send("Servico not found");
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Error in finding Servicos");
        }
    }
);
export default RoutesFuncionario;