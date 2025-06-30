import { Request, Response, Router } from "express";
import {
  deleteCliente,
  getClienteByCPF,
  getClienteById,
  getClientePage,
  getClientesBySalao,
  postCliente,
  updateCliente,
} from "../services/ServiceClient";
import {
  authenticate,
  cadastrarCliente,
  postLogin,
  registerLogin,
} from "../services/Service";
import { userTypes } from "../models/tipo-usuario.enum";

const RoutesCliente = Router();

RoutesCliente.post(
  "/cadastrar/cliente",
  async (req: Request, res: Response) => {
    let { CPF, Nome, Email, Telefone, SalaoId, Password, userType } = req.body;
    try {
      if (
        !CPF ||
        !Nome ||
        !Email ||
        !Telefone ||
        !SalaoId ||
        !Password ||
        !userType
      ) {
        res.status(400).json({
          message:
            "Erro ao cadastrar cliente, parametros ausentes ou invalidos",
        });
      } else {
        const result = await cadastrarCliente(
          CPF,
          Nome,
          Email,
          Telefone,
          SalaoId,
          Password,
          userType
        );

        if (result) {
          res.status(201).json(result);
        } else {
          res.status(500).json({ message: "Erro ao cadastrar cliente" });
        }
      }
    } catch (erro) {
      console.log(erro);
      res.status(500).send("Error criando cliente");
    }
  }
);

RoutesCliente.get("/cliente/checkcpf/:cpf/:salaoId", async (req, res) => {
  const { cpf, salaoId } = req.params;
  try {
    const cliente = await getClienteByCPF(cpf, salaoId);
    if (cliente) {
      res.status(200).json(true);
    } else {
      res.status(204).json(false);
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

RoutesCliente.get("/cliente/page", async (req: Request, res: Response) => {
  const page = (req.query.page as string) || "0";
  const limit = (req.query.limit as string) || "10";
  const salaoId = (req.query.salaoId as string) || "";
  const includeRelations = req.query.include === "true";
  const termoBusca = (req.query.termoBusca as string) || "";
  const campoBusca = (req.query.campoBusca as string) || "";
  const dataFilter = (req.query.dataFilter as string) || "";
  try {
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString(
        "utf-8"
      ) || "{}"
    );
    if (
      !userInfo ||
      !userInfo.userID ||
      !userInfo.token ||
      !userInfo.userType
    ) {
      console.log("Informações de auntenticação ausentes ou inválidas");
      res.status(403).json({ message: "Unauthorized" });
    } else {
      let userType = userInfo.userType;
      const auth = await authenticate(
        userInfo.userID,
        userInfo.token,
        userInfo.userType
      );
      if (
        auth &&
        [
          userTypes.FUNCIONARIO,
          userTypes.ADM_SALAO,
          userTypes.ADM_SISTEMA,
        ].includes(userType)
      ) {
        const clientes = await getClientePage(
          page,
          limit,
          salaoId,
          includeRelations,
          termoBusca,
          campoBusca,
          dataFilter
        );
        if (clientes) {
          res.status(200).json(clientes);
        } else {
          throw new Error("Erro ao buscar clientes");
        }
      } else {
        console.log("Chamada não autorizada");
        res.status(403).json({ message: "Não autorizado" });
      }
    }
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

RoutesCliente.put("/cliente/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { CPF, Nome, Email, Telefone, SalaoId, newPassword } = req.body;

  const clienteData = {
    CPF,
    Nome,
    Email,
    Telefone,
    SalaoId,
  };

  try {
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString("utf-8") || "{}"
    );

    const auth = await authenticate(
      userInfo.userID,
      userInfo.token,
      userInfo.userType
    );

    if (auth && id === userInfo.userID) {
      const cliente = await updateCliente(id, clienteData, newPassword);
      if (cliente) {
        res.status(200).json(cliente);
      } else {
        throw new Error("Erro ao atualizar cliente");
      }
    } else {
      res.status(403).json({ message: "Não autorizado a fazer esta chamada" });
    }
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

RoutesCliente.get("/cliente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString(
        "utf-8"
      ) || "{}"
    );
    if (
      !userInfo ||
      !userInfo.userID ||
      !userInfo.token ||
      !userInfo.userType
    ) {
      console.log("Informações de auntenticação ausentes ou inválidas");
      res.status(403).json({ message: "Unauthorized" });
    } else {
      const auth = await authenticate(
        userInfo.userID,
        userInfo.token,
        userInfo.userType
      );
      if (auth) {
        const cliente = await getClienteById(id);
        if (cliente) {
          res.status(200).json(cliente);
        } else {
          res.status(204).json({ message: "Cliente não encontrado" });
        }
      } else {
        res.status(403).json({
          message: "Não autorizado a fazer esta chamada",
        });
      }
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

RoutesCliente.get("/cliente/cpf/:cpf/:salaoId", async (req, res) => {
  const { cpf, salaoId } = req.params;
  try {
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString(
        "utf-8"
      ) || "{}"
    );
    if (
      !userInfo ||
      !userInfo.userID ||
      !userInfo.token ||
      !userInfo.userType
    ) {
      console.log("Informações de auntenticação ausentes ou inválidas");
      res.status(403).json({ message: "Unauthorized" });
    } else {
      const auth = await authenticate(
        userInfo.userID,
        userInfo.token,
        userInfo.userType
      );
      if (auth) {
        const cliente = await getClienteByCPF(cpf, salaoId);
        if (cliente) {
          res.status(200).json(cliente);
        } else {
          res.status(204).json({ message: "Cliente não encontrado" });
        }
      } else {
        res.status(403).json({
          message: "Não autorizado a fazer esta chamada",
        });
      }
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

RoutesCliente.delete("/cliente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString(
        "utf-8"
      ) || "{}"
    );
    if (
      !userInfo ||
      !userInfo.userID ||
      !userInfo.token ||
      !userInfo.userType
    ) {
      res.status(403).json({ message: "Não autorizado" });
    } else {
      let userType = userInfo.userType;
      const auth = await authenticate(
        userInfo.userID,
        userInfo.token,
        userInfo.userType
      );
      if (
        auth &&
        [userTypes.ADM_SALAO, userTypes.ADM_SISTEMA].includes(userType)
      ) {
        const cliente = await deleteCliente(id);
        if (cliente) {
          res.status(204).json({ message: "Cliente deletado com sucesso" });
        } else {
          throw new Error("Erro ao deletar cliente");
        }
      } else {
        res.status(403).json({
          message: "Não autorizado a fazer esta chamada",
        });
      }
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

RoutesCliente.get(
  "/cliente/salaoId/:salaoId",
  async (req: Request, res: Response) => {
    const { salaoId } = req.params;
    const include = req.query.include === "true";
    try {
      const userInfo = JSON.parse(
        Buffer.from(req.headers.authorization || "", "base64").toString(
          "utf-8"
        ) || "{}"
      );
      if (
        !userInfo ||
        !userInfo.userID ||
        !userInfo.token ||
        !userInfo.userType
      ) {
        res.status(403).json({ message: "Não autorizado" });
      }
      let userType = userInfo.userType;
      const auth = await authenticate(
        userInfo.userID,
        userInfo.token,
        userInfo.userType
      );
      if (
        auth &&
        [
          userTypes.CABELEIREIRO,
          userTypes.FUNCIONARIO,
          userTypes.ADM_SALAO,
          userTypes.ADM_SISTEMA,
        ].includes(userType)
      ) {
        if (!salaoId) {
          res.status(400).json({ message: "SalaoId é obrigatório." });
        }
        const clientes = await getClientesBySalao(salaoId, include);
        if (clientes) {
          res.status(200).json(clientes);
        } else {
          throw new Error("Erro ao buscar clientes do salão");
        }
      } else {
        res.status(403).json({
          message: "Não autorizado a fazer esta chamada",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar clientes do salão:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);

export default RoutesCliente;
