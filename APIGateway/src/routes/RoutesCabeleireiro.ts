import { Router, Request, Response } from "express";
import { authenticate, postLogin, registerLogin } from "../services/Service";
import { createPortfolio,  deletePortfolio } from "../services/ServiceImag";
import {
  deleteCabeleireiro,
  getCabeleireiroById,
  getCabeleireiroBySalao,
  getCabeleireiroPage,
  postCabeleireiro,
  updateCabeleireiro,
} from "../services/ServiceCabelereiro";
import { userTypes } from "../models/tipo-usuario.enum";

const RoutesCabeleireiro = Router();

RoutesCabeleireiro.post(
  "/cabeleireiro",
  async (req: Request, res: Response) => {
    let { CPF, Nome, Email, Telefone, SalaoId, Password, userType, Mei } =
      req.body;
    try {
      const userInfo = JSON.parse(
        Buffer.from(req.headers.authorization || "", "base64").toString(
          "utf-8"
        ) || "{}"
      );
      if (!userInfo || !userInfo.userID || !userInfo.token || !userInfo.userType) {
      console.log("Informações de autenticação ausente ou inválidas");
      res.status(403).json({ message: "Unauthorized" });
      } else {
      let userTypeAuth = userInfo.userType;
      const auth = await authenticate(
        userInfo.userID,
        userInfo.token,
        userInfo.userType
      );
      if (
        !auth ||
        ![
          userTypes.FUNCIONARIO,
          userTypes.ADM_SALAO,
          userTypes.ADM_SISTEMA,
        ].includes(userTypeAuth)
      ) {
        res.status(403).json({ message: "Unauthorized" });
        } else {
          let cabeleireiro = await postCabeleireiro({
            CPF: CPF,
            Nome: Nome,
            Email: Email,
            Telefone: Telefone,
            Mei: Mei,
            SalaoId: SalaoId,
          });
          if (!cabeleireiro) {
            throw new Error("Cabeleireiro not created");
          }
          let portfolio = await createPortfolio(
            cabeleireiro.ID!,
            "Portfolio de " + Nome,
            SalaoId
          )
            if (!portfolio) {
              console.log("Portfolio not created");
              let cabeleireiroDelete = await deleteCabeleireiro(cabeleireiro.ID!);
              if (cabeleireiroDelete) {
                console.log("Cabeleireiro deleted successfully");
              } else {
                console.log("Falha ao deletar cabeleireiro após falha na criação do portfolio");
              }
              throw new Error("Portfolio creation failed");
            }
          console.log("Cabeleireiro ID: ", cabeleireiro.ID);
          let register = await registerLogin(
            cabeleireiro.ID!,
            Email,
            String(Password),
            SalaoId,
            userType
          );
            if (!register) {
              console.log("Register failed");
              let cabeleireiroDelete = await deleteCabeleireiro(cabeleireiro.ID!);
              let portfolioDelete = await deletePortfolio(portfolio.ID!);
              if (cabeleireiroDelete && portfolioDelete) {
                console.log("Cabeleireiro e Portfolio deletados com sucesso.");
              } else if (!cabeleireiroDelete) {
                console.log("Falha ao deletar cabeleireiro após falha no registro");
              } else if (!portfolioDelete) {
                console.log("Falha ao deletar portfolio após falha no registro");
              }
          throw new Error("Login registration failed");
          }
          let token = await postLogin(Email, Password, SalaoId);
          res.status(200).send(token);
        }
      }
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
  "/cabeleireiro/salao/:salaoId",
  async (req: Request, res: Response) => {
    let { salaoId } = req.params;
    let { includeRelations } = req.query;
    try {console.log("salao ", salaoId);
      console.log("req.params:", req.params);
console.log("req.url:", req.url);
      let cabeleireiros = await getCabeleireiroBySalao(
        salaoId ? String(salaoId) : "",
        Boolean(includeRelations === "true"),
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
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString(
        "utf-8"
      ) || "{}"
    );
    let userTypeAuth = userInfo.userType;
    const auth = await authenticate(
      userInfo.userID,
      userInfo.token,
      userInfo.userType
    );
    if (
      !auth ||
      ![
        userTypes.CABELEIREIRO,
        userTypes.FUNCIONARIO,
        userTypes.ADM_SALAO,
        userTypes.ADM_SISTEMA,
      ].includes(userTypeAuth)
    ) {
      res.status(403).json({ message: "Unauthorized" });
    } else {
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
  }
);

RoutesCabeleireiro.delete(
  "/cabeleireiro/delete/:id",
  async (req: Request, res: Response) => {
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString(
        "utf-8"
      ) || "{}"
    );
    let userTypeAuth = userInfo.userType;
    const auth = await authenticate(
      userInfo.userID,
      userInfo.token,
      userInfo.userType
    );
    if (
      !auth ||
      ![
        userTypes.FUNCIONARIO,
        userTypes.ADM_SALAO,
        userTypes.ADM_SISTEMA,
      ].includes(userTypeAuth)
    ) {
      res.status(403).json({ message: "Unauthorized" });
    } else {
      let { id } = req.params;
      try {
        let cabeleireiro = await deleteCabeleireiro(id);
        res.status(200).send(cabeleireiro);
      } catch (e) {
        console.log(e);
        res.status(500).send("Error deleting Cabeleireiros");
      }
    }
  }
);

RoutesCabeleireiro.put("/cabeleireiro", async (req: Request, res: Response) => {
  let { ID, CPF, Nome, Email, Telefone, Mei, SalaoId, Password } = req.body;
  try {
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString(
        "utf-8"
      ) || "{}"
    );
    let userTypeAuth = userInfo.userType;
    const auth = await authenticate(
      userInfo.userID,
      userInfo.token,
      userInfo.userType
    );
    if (
      !auth ||
      ![
        userTypes.FUNCIONARIO,
        userTypes.ADM_SALAO,
        userTypes.ADM_SISTEMA,
      ].includes(userTypeAuth)
    ) {
      res.status(403).json({ message: "Unauthorized" });
    } else {
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
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Error updating Cabeleireiros");
  }
});

//Todas as outras funções vão usar a função de authenticate no Service para verificar se o usuário é quem diz ser, pra depois permitir.
export default RoutesCabeleireiro;
