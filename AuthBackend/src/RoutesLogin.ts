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
export default RoutesLogin;
