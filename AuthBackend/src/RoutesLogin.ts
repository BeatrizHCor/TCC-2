import { Router, Request, Response } from "express";
import { postLogin } from "./Controller";

const RoutesLogin = Router();

RoutesLogin.get("/login", (req: Request, res: Response) => {
  res.send("This is a login, please use post");
});

RoutesLogin.post("/login", (req: Request, res: Response) => {
  let { userID, email, password, salaoID } = req.body;
  postLogin(userID, email, password, salaoID)
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

export default RoutesLogin;
