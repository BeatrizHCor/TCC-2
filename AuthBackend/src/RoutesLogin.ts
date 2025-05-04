import { Router, Request, Response } from "express";
import {
  registerLogin,
  verifyPasswordAndReturnToken,
  verifyTokenAndType,
} from "./Controller";

const RoutesLogin = Router();

RoutesLogin.get("/login", (req: Request, res: Response) => {
  res.send("This is a login, please use post");
});

RoutesLogin.post("/register", (req: Request, res: Response) => {
  let { userID, email, password, salaoId, userType } = req.body;
  registerLogin(userID, email, password, salaoId, userType)
    .then((r) => {
      if (r) {
        res.status(201).json({ message: "login created" });;
      } else {
        res.status(403).json({ message: "problema ao criar login" });;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ message: "erro" });;
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

export default RoutesLogin;
