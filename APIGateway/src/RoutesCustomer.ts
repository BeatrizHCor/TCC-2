import { Router, Request, Response } from "express";
import { Cliente } from "./models/clienteModel";
import { postCliente, postLogin, registerLogin } from "./Service";
const RoutesCustomer = Router();

//Lógica feita, ainda não testado. Da pra deixar o código mais limpo mas a idéia é esse fluxo. No fim ja retorna um token.
RoutesCustomer.post("/cliente", async (req: Request, res: Response) => {
  let { CPF, Nome, Email, Telefone, SalaoId, Password, userType } = req.body;
  try {
    let cliente = await postCliente(CPF, Nome, Email, Telefone, SalaoId);
    let register = await registerLogin(
      userType,
      cliente.id!,
      Email,
      Password,
      SalaoId
    );
    let token = await postLogin(Email, Password, SalaoId);
    res.status(200).send(token);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error in creating customer");
  }
});

//Todas as outras funções vão usar a função de authenticate no Service para verificar se o usuário é quem diz ser, pra depois permitir.
export default RoutesCustomer;
