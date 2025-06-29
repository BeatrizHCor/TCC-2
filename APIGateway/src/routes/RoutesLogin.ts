import { Router, Request, Response } from "express";

const RoutesLogin = Router();
const loginURL = process.env.AUTH_URL || "http://localhost:3000";
//Acabei misturando o que é route com o que é controller, separar pra deixar o código mais bonito depois.

RoutesLogin.post("/login", async (req: Request, res: Response) => {
  console.log("body:", req.body);
  console.log(loginURL);
  const { Email, SalaoID, password } = req.body;
  let response = await fetch(loginURL + "/login", {
    method: "POST",
    body: JSON.stringify({ Email, SalaoID, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    let token = await response.json();
    res.status(200).send(token);
  } else {
    console.log(loginURL);

    res.status(403).send();
  }
});

RoutesLogin.post("/authenticate", async (req: Request, res: Response) => {
  let response = await fetch(loginURL + "/authenticate", {
    method: "POST",
    body: req.body,
  });
  if (response.ok) {
    let token = await response.json();
    res.status(200).send(token);
  } else {
    res.status(403).send();
  }
});

//Logout não implementado no AuthService
RoutesLogin.post("/logout", async (req: Request, res: Response) => {
  let response = await fetch(loginURL + "/logout", {
    method: "POST",
    body: req.body,
  });
  if (response.ok) {
    res.status(200).send("loggin out");
  } else {
    res.status(403).send();
  }
});

export default RoutesLogin;
