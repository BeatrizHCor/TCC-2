import { Router, Request, Response } from "express";
import { registerLogin, verifyPasswordAndReturnToken } from "./Controller";

const RoutesLogin = Router();

RoutesLogin.get("/login", (req: Request, res: Response) => {
  res.send("This is a login, please use post");
});

RoutesLogin.post("/register", (req: Request, res: Response) => {
  let { userID, email, password, salaoID } = req.body;
  registerLogin(userID, email, password, salaoID)
    .then((r) => {
      if (r) {
        res.status(201).send("login created");
      } else {
        res.status(403).send("Not able to create login");
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("something went wrong");
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

export default RoutesLogin;
