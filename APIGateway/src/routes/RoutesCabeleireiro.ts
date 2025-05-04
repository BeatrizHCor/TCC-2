import { Router, Request, Response } from "express";
import { postLogin, registerLogin } from "../services/Service";
import {
  deleteCabeleireiro,
  getCabeleireiroById,
  getCabeleireiroPage,
  postCabeleireiro,
  updateCabeleireiro,
} from "../services/ServiceCabelereiro";

const RoutesCabeleireiro = Router();

//Lógica feita, ainda não testado. Da pra deixar o código mais limpo mas a idéia é esse fluxo. No fim ja retorna um token.
RoutesCabeleireiro.post(
  "/cabeleireiro",
  async (req: Request, res: Response) => {
    let { CPF, Nome, Email, Telefone, SalaoId, Password, userType, Mei } =
      req.body;
    try {
      console.log("tipo de user", typeof userType, userType);

      let cabeleireiro = await postCabeleireiro({
        CPF: CPF,
        Nome: Nome,
        Email: Email,
        Telefone: Telefone,
        Mei: Mei,
        SalaoId: SalaoId,
      });
      console.log("resultado create no controler", cabeleireiro);
      let register = await registerLogin(
        cabeleireiro.ID!,
        Email,
        String(Password),
        SalaoId,
        userType
      );
      console.log("resultado register no controler", register);
      if (register.status !== 201) {
        console.log("Register failed");
        let cabeleireiroDelete = await deleteCabeleireiro(cabeleireiro.ID!);
        if (cabeleireiroDelete) {
          console.log("Cabeleireiro deleted successfully");
        } else {
          console.log("Failed to delete cabeleireiro after register failure");
        }
        throw new Error("Login registration failed");
      }
      let token = await postLogin(Email, Password, SalaoId);
      res.status(200).send(token);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error in creating Cabeleireiro");
    }
  }
);

RoutesCabeleireiro.get(
  "/cabeleireiro/page",
  async (req: Request, res: Response) => {
    let { page, limit, includeRelations, salaoId, nome } = req.query;
    try {
      let cabeleireiros = await getCabeleireiroPage(
        Number(page),
        Number(limit),
        Boolean(includeRelations === "true"),
        salaoId ? Number(salaoId) : undefined,
        nome ? String(nome) : undefined
      );
      res.status(200).send(cabeleireiros);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error querying Cabeleireiros");
    }
  }
);

RoutesCabeleireiro.get(
  "/cabeleireiro/ID/:id",
  async (req: Request, res: Response) => {
    let { id } = req.params;
    const includeRelations = req.query.include === "true";
    try {
      let cabeleireiro = await getCabeleireiroById(id, includeRelations);
      res.status(200).send(cabeleireiro);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error querying Cabeleireiros");
    }
  }
);

RoutesCabeleireiro.delete(
  "/cabeleireiro/delete/:id",
  async (req: Request, res: Response) => {
    let { id } = req.params;
    try {
      let cabeleireiro = await deleteCabeleireiro(id);
      res.status(200).send(cabeleireiro);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error deleting Cabeleireiros");
    }
  }
);

RoutesCabeleireiro.put("/cabeleireiro", async (req: Request, res: Response) => {
  let { ID, CPF, Nome, Email, Telefone, Mei, SalaoId, Password } = req.body;
  try {
    let cabeleireiro = await updateCabeleireiro(
      Email,
      CPF,
      Telefone,
      SalaoId,
      Mei,
      Nome,
      ID
    );
    res.status(200).send(cabeleireiro);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error updating Cabeleireiros");
  }
});

//Todas as outras funções vão usar a função de authenticate no Service para verificar se o usuário é quem diz ser, pra depois permitir.
export default RoutesCabeleireiro;
