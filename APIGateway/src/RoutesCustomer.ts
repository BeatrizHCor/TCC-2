import { Router, Request, Response } from "express";
import { Cliente } from "./models/clienteModel";

const RoutesCustomer = Router();
const CustomerURL = process.env.CustomerURL || "";
const loginURL = process.env.AuthURL || "";
//Lógica feita, ainda não testado. Da pra deixar o código mais limpo mas a idéia é esse fluxo. No fim ja retorna um toke e faz o primeiro login automático.
RoutesCustomer.post("/cliente", async (req: Request, res: Response) => {
  let { CPF, Nome, Email, Telefone, SalaoId, Password, userType } = req.body;
  try {
    let responseCliente = await fetch(CustomerURL + "/cliente", {
      method: "POST",
      body: JSON.stringify({ CPF, Nome, Email, Telefone, SalaoId }),
    });
    if (responseCliente.ok) {
      let cliente: Cliente = await responseCliente.json();
      let responseLogin = await fetch(loginURL + "/register", {
        method: "POST",
        body: JSON.stringify({
          userType,
          userID: cliente.id!,
          email: Email,
          password: Password,
          salaoId: SalaoId,
        }),
      });
      if (responseLogin.ok) {
        let responseLogin = await fetch(loginURL + "/login", {
          method: "POST",
          body: JSON.stringify({
            email: Email,
            password: Password,
            salaoId: SalaoId,
          }),
        });
        if (responseLogin.ok) {
          let token = await responseLogin.json();
          res.status(200).send(token);
        } else {
          res.status(403).send();
        }
      } else {
        await fetch(
          CustomerURL + `/cliente/delete/${cliente.Email}/${cliente.SalaoId}`
        );
        throw new Error("Error in posting login");
      }
    } else {
      throw new Error("Error in posting customer");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Error in creating customer");
  }
});
export default RoutesCustomer;
