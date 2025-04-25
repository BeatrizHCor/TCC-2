import { Router, Request, Response } from "express";
import { Cliente } from "./models/clienteModel";
import { postCliente, postLogin, registerLogin, getClientePage, getClienteByCPF } from "./Service";
const RoutesCustomer = Router();

//Lógica feita, ainda não testado. Da pra deixar o código mais limpo mas a idéia é esse fluxo. No fim ja retorna um token.
RoutesCustomer.post("/cliente", async (req: Request, res: Response) => {
  let { CPF, Nome, Email, Telefone, SalaoId, Password, userType } = req.body;
  try {
    let cliente = await postCliente(CPF, Nome, Email, Telefone, SalaoId);
    if (!cliente || !cliente.ID) {
      throw new Error("Cliente creation failed or ID is undefined");
    }
    let register = await registerLogin(
      cliente.ID,
      Email,
      Password,
      SalaoId,
      userType
    );
    let token = await postLogin(Email, Password, SalaoId);
    res.status(200).send(token);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error in creating customer");
  }
});

RoutesCustomer.get("/cliente/page", async (req: Request, res: Response) => {
  const page = (req.query.page as string) || '0';
  const limit = (req.query.limit as string) || '10';
  const includeRelations = req.query.include === "true" ? true : false;
  const salaoId = req.query.salaoId as string || '';

  try {
    const clientes = await getClientePage(page, limit, includeRelations, salaoId);
    res.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

RoutesCustomer.get("/cliente/cpf/:cpf/:salaoId", async (req, res) => {
  const { cpf, salaoId } = req.params;
  try {
    const cliente = await getClienteByCPF(cpf, salaoId);
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(204).json({ message: "Cliente não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }

});
//Todas as outras funções vão usar a função de authenticate no Service para verificar se o usuário é quem diz ser, pra depois permitir.
export default RoutesCustomer;
