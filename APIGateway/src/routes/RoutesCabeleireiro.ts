import { Request, Response, Router } from "express";
import {
  authenticate,
  cadastrarCabeleireiro,
  postLogin,
  registerLogin,
} from "../services/Service";
import {
  deleteCabeleireiro,
  getCabeleireiroById,
  getCabeleireiroBySalao,
  getCabeleireiroNomesPage,
  getCabeleireiroPage,
  postCabeleireiro,
  updateCabeleireiro,
} from "../services/ServiceCabelereiro";
import { userTypes } from "../models/tipo-usuario.enum";
import { getUserInfoAndAuth } from "../utils/FazerAutenticacaoEGetUserInfo";

const RoutesCabeleireiro = Router();

RoutesCabeleireiro.post(
  "/cadastrar/cabeleireiro",
  async (req: Request, res: Response) => {
    let { CPF, Nome, Email, Telefone, SalaoId, Password, userType, Mei } =
      req.body;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
        return;
      } else {
        if (
          !auth ||
          ![
            userTypes.FUNCIONARIO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          res.status(403).json({ message: "Unauthorized" });
        } else {
          console.log("gateway: ", Nome);

          if (
            !CPF || !Nome || !Email || !Telefone || !SalaoId || !Password ||
            !Mei ||
            !userType
          ) {
            res.status(400).json({
              message:
                "Erro ao cadastrar cabeleireiro, parametros ausentes ou invalidos",
            });
          } else {
            const result = await cadastrarCabeleireiro(
              CPF,
              Nome,
              Email,
              Telefone,
              SalaoId,
              Mei,
              Password,
              userType,
            );

            if (result) {
              res.status(201).json(result);
            } else {
              res.status(500).json({
                message: "Erro ao cadastrar cabeleireiro",
              });
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).send("Error in creating Cabeleireiro");
    }
  },
);

RoutesCabeleireiro.get(
  "/cabeleireiro/page",
  async (req: Request, res: Response) => {
    let { page, limit, includeRelations, salaoId, nome } = req.query;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
        return;
      } else {
        if (
          !auth &&
          ![
            userTypes.FUNCIONARIO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          res.status(403).json({ message: "Unauthorized" });
        } else {
          let cabeleireiros = await getCabeleireiroPage(
            Number(page),
            Number(limit),
            Boolean(includeRelations === "true"),
            salaoId ? Number(salaoId) : undefined,
            nome ? String(nome) : undefined,
          );
          res.status(200).send(cabeleireiros);
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).send("Error querying Cabeleireiros");
    }
  },
);

RoutesCabeleireiro.get(
  "/cabeleireiro/nomes/page",
  async (req: Request, res: Response) => {
    let { page, limit, salaoId, nome } = req.query;
    try {
      let cabeleireiros = await getCabeleireiroNomesPage(
        Number(page),
        Number(limit),
        salaoId ? Number(salaoId) : undefined,
        nome ? String(nome) : undefined,
      );
      res.status(200).send(cabeleireiros);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error querying Cabeleireiros");
    }
  },
);

RoutesCabeleireiro.get(
  "/cabeleireiro/salao/:salaoId",
  async (req: Request, res: Response) => {
    let { salaoId } = req.params;
    let { includeRelations } = req.query;
    try {
      let cabeleireiros = await getCabeleireiroBySalao(
        salaoId ? String(salaoId) : "",
        Boolean(includeRelations === "true"),
      );
      res.status(200).send(cabeleireiros);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error querying Cabeleireiros");
    }
  },
);
RoutesCabeleireiro.get(
  "/cabeleireiro/ID/:id",
  async (req: Request, res: Response) => {
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString(
        "utf-8",
      ) || "{}",
    );
    let userTypeAuth = userInfo.userType;
    const auth = await authenticate(
      userInfo.userID,
      userInfo.token,
      userInfo.userType,
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
  },
);

RoutesCabeleireiro.delete(
  "/cabeleireiro/delete/:id",
  async (req: Request, res: Response) => {
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString(
        "utf-8",
      ) || "{}",
    );
    let userTypeAuth = userInfo.userType;
    const auth = await authenticate(
      userInfo.userID,
      userInfo.token,
      userInfo.userType,
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
  },
);

RoutesCabeleireiro.put("/cabeleireiro", async (req: Request, res: Response) => {
  let { ID, CPF, Nome, Email, Telefone, Mei, SalaoId, Password } = req.body;
  try {
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString(
        "utf-8",
      ) || "{}",
    );
    let userTypeAuth = userInfo.userType;
    const auth = await authenticate(
      userInfo.userID,
      userInfo.token,
      userInfo.userType,
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
        ID,
      );
      res.status(200).send(cabeleireiro);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Error updating Cabeleireiros");
  }
});

export default RoutesCabeleireiro;
