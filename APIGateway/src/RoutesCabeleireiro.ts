import { Router, Request, Response } from "express";
import {
  getCabeleireiroPage,
  postCabeleireiro,
  postCliente,
  postLogin,
  registerLogin,
} from "./Service";
const RoutesCabeleireiro = Router();

//Lógica feita, ainda não testado. Da pra deixar o código mais limpo mas a idéia é esse fluxo. No fim ja retorna um token.
RoutesCabeleireiro.post(
  "/cabeleireiro",
  async (req: Request, res: Response) => {
    let { CPF, Nome, Email, Telefone, SalaoId, Password, userType, mei } =
      req.body;
    try {
      let cabeleireiro = await postCabeleireiro({
        cpf: CPF,
        nome: Nome,
        email: Email,
        telefone: Telefone,
        salaoId: SalaoId,
        mei,
        agendamentos: [],
        holerite: [],
      });

      let register = await registerLogin(
        userType,
        cabeleireiro.id!,
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
  }
);

RoutesCabeleireiro.get(
  "/cabeleireiro/page",
  async (req: Request, res: Response) => {
    let { page, limit, includeRelations, salaoId } = req.query;
    try {
      let cabeleireiros = await getCabeleireiroPage(
        Number(page),
        Number(limit),
        Boolean(includeRelations === "true"),
        Number(salaoId)
      );
      res.status(200).send(cabeleireiros);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error querying Cabeleireiros");
    }
  }
);

//Todas as outras funções vão usar a função de authenticate no Service para verificar se o usuário é quem diz ser, pra depois permitir.
export default RoutesCabeleireiro;
