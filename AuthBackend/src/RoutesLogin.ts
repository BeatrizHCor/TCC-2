import { Request, Response, Router } from "express";
import {
  deleteAuth,
  registerLogin,
  verifyPasswordAndReturnToken,
  verifyTokenAndType,
} from "./Controller";
import {
  deleteCliente,
  getClienteByCPF,
  postCliente,
} from "./Services/ServiceClient";
import {
  deleteFuncionario,
  getFuncionarioByCpf,
  postFuncionario,
} from "./Services/ServiceFunc";
import { createPortfolio, deletePortfolio } from "./Services/ServiceImag";
import {
  deleteCabeleireiro,
  postCabeleireiro,
} from "./Services/ServiceCabelereiro";
import { StatusCadastro } from "@prisma/client";

const RoutesLogin = Router();

RoutesLogin.get("/login", (req: Request, res: Response) => {
  res.send("This is a login, please use post");
});

RoutesLogin.post("/register", (req: Request, res: Response) => {
  let { userID, Email, Password, SalaoId, userType } = req.body;
  if (typeof Password !== "string" || Password.trim() === "") {
    res.status(400).json({ message: "Password inválido" });
    return;
  }
  registerLogin(userID, Email, Password, SalaoId, userType)
    .then((r) => {
      if (r) {
        res.status(201).json({ status: 201, message: "login created" });
      } else {
        res
          .status(403)
          .json({ status: 403, message: "problema ao criar login" });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ message: "erro" });
    });
});

RoutesLogin.post("/login", async (req: Request, res: Response) => {
  let { Email, password, SalaoID } = req.body;
  console.log(req.body);
  console.log(req.body);
  let token = await verifyPasswordAndReturnToken(Email, password, SalaoID);
  if (token) {
    res.status(200).send(token);
  } else {
    res.status(401).send();
  }
});

RoutesLogin.post("/authenticate", async (req: Request, res: Response) => {
  let { userID, token, userType } = req.body;
  let newToken = await verifyTokenAndType(token, userID, userType);
  if (newToken) {
    res.status(200).send(newToken);
  } else {
    res.status(403).send();
  }
});

RoutesLogin.delete("/login", (req: Request, res: Response) => {
  let { userID } = req.body;
  deleteAuth(userID)
    .then((r) => {
      if (r) {
        res.status(200).json({ message: "login deleted" });
      } else {
        res.status(403).json({ message: "problema ao deletar login" });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ message: "erro" });
    });
});

RoutesLogin.post("/cadastrar/cliente", async (req: Request, res: Response) => {
  let { CPF, Nome, Email, Telefone, SalaoId, Password, userType } = req.body;
  try {
    let ChecarCPF = await getClienteByCPF(CPF, SalaoId);
    console.log("Resposta de checagem de cpf:", ChecarCPF);
    if (ChecarCPF) {
      res.status(409).json({ message: "CPF já cadastrado no salão" });
      return;
    }
    let cliente = await postCliente(CPF, Nome, Email, Telefone, SalaoId);
    if (!cliente) {
      throw new Error("Cliente not created");
    }
    console.log("Cliente ID: ", cliente.ID);
    let register = await registerLogin(
      cliente.ID!,
      Email,
      Password,
      SalaoId,
      userType
    );
    if (!register) {
      console.log("Register auth failed");
      let clienteDelete = await deleteCliente(cliente.ID!);
      if (clienteDelete) {
        console.log("Cliente deleted successfully");
      } else {
        console.log("Failed to delete cliente after register failure");
      }
      throw new Error("Login registration failed");
    }
    let token = await verifyPasswordAndReturnToken(Email, Password, SalaoId);
    res.status(200).send(token);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error in creating customer");
  }
});

RoutesLogin.post(
  "/cadastrar/funcionario",
  async (req: Request, res: Response) => {
    let {
      CPF,
      Nome,
      Email,
      Telefone,
      SalaoId,
      Auxiliar,
      Salario,
      Password,
      userType,
    } = req.body;
    try {
      let ChecarCPF = await getFuncionarioByCpf(CPF, SalaoId);
      console.log("Resposta de checagem de cpf:", ChecarCPF);
      if (ChecarCPF) {
        res.status(409).json({ message: "CPF já cadastrado no salão" });
        return;
      }
      let funcionario = await postFuncionario(
        CPF,
        Nome,
        Email,
        Telefone,
        SalaoId,
        Auxiliar,
        Salario
      );
      if (!funcionario) {
        throw new Error("Funcionario not created");
      }
      let register = await registerLogin(
        funcionario.ID!,
        Email,
        Password,
        SalaoId,
        userType
      );
      if (!register) {
        console.log("Register auth failed, deleting user");
        let funcionarioDelete = await deleteFuncionario(funcionario.ID!);
        if (funcionarioDelete) {
          console.log("Funcionario deleted successfully");
        } else {
          console.log("Failed to delete funcionario after register failure");
        }
        throw new Error("Login registration failed");
      }
      let token = await verifyPasswordAndReturnToken(Email, Password, SalaoId);

      res.status(200).send(token);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error in creating Funcionario");
    }
  }
);

RoutesLogin.post(
  "/cadastrar/cabeleireiro",
  async (req: Request, res: Response) => {
    let { CPF, Nome, Email, Telefone, SalaoId, Password, userType, Mei } =
      req.body;
    try {
      let cabeleireiro = await postCabeleireiro(
        CPF,
        Nome,
        Email,
        Telefone,
        SalaoId,
        Mei
      );
      if (!cabeleireiro) {
        throw new Error("Cabeleireiro not created");
      }
      let portfolio = await createPortfolio(
        cabeleireiro.ID!,
        "Portfolio de " + Nome,
        SalaoId
      );
      if (!portfolio) {
        console.log("Portfolio not created");
        let cabeleireiroDelete = await deleteCabeleireiro(cabeleireiro.ID!);
        if (cabeleireiroDelete) {
          console.log("Cabeleireiro deleted successfully");
        } else {
          console.log(
            "Falha ao deletar cabeleireiro após falha na criação do portfolio"
          );
        }
        throw new Error("Portfolio creation failed");
      } else {
        console.log("Cabeleireiro ID: ", cabeleireiro.ID);
        let register = await registerLogin(
          cabeleireiro.ID!,
          Email,
          String(Password),
          SalaoId,
          userType
        );
        if (!register) {
          console.log("Register failed");
          let cabeleireiroDelete = await deleteCabeleireiro(cabeleireiro.ID!);
          let portfolioDelete = await deletePortfolio(portfolio.ID!);
          if (cabeleireiroDelete && portfolioDelete) {
            console.log("Cabeleireiro e Portfolio deletados com sucesso.");
          } else if (!cabeleireiroDelete) {
            console.log("Falha ao deletar cabeleireiro após falha no registro");
          } else if (!portfolioDelete) {
            console.log("Falha ao deletar portfolio após falha no registro");
          }
          throw new Error("Login registration failed");
        }
        let token = await verifyPasswordAndReturnToken(
          Email,
          Password,
          SalaoId
        );
        res.status(200).send(token);
      }
    } catch (e) {
      console.log(e);
      res.status(500).send("Error in creating Cabeleireiro");
    }
  }
);
export default RoutesLogin;
