import { Router, Request, Response } from "express";
import {
  registerLogin,
  verifyPasswordAndReturnToken,
  verifyTokenAndType,
  deleteAuth,
} from "./Controller";

const RoutesLogin = Router();

RoutesLogin.get("/login", (req: Request, res: Response) => {
  res.send("This is a login, please use post");
});

RoutesLogin.post("/register", (req: Request, res: Response) => {
  let { userID, Email, Password, SalaoId, userType } = req.body;
  console.log("Password recebido:", Password);
  if (typeof Password !== "string" || Password.trim() === "") {
    res.status(400).json({ message: "Password inválido" });
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
  let { email, password, salaoID } = req.body;
  let token = await verifyPasswordAndReturnToken(email, password, salaoID);
  if (token) {
    res.send(token).status(200);
  } else {
    res.status(401).send();
  }
});

RoutesLogin.post("/authenticate", async (req: Request, res: Response) => {
  let { userID, token, userType } = req.body;
  let newToken = await verifyTokenAndType(token, userID, userType);
  if (newToken) {
    res.send(newToken).status(200);
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

export default RoutesLogin;
