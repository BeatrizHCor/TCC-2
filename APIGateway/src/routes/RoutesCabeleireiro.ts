import { Request, Response, Router } from "express";
import {
  authenticate,
  cadastrarCabeleireiro,
  updateLoginPassword,
} from "../services/Service";
import {
  deleteCabeleireiro,
  getCabeleireiroById,
  getCabeleireiroBySalao,
  getCabeleireiroNomesPage,
  getCabeleireiroPage,
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
          if (
            !CPF || !Nome || !Email || !Telefone || !SalaoId || !Password ||
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
    let { page, limit, includeRelations, mostrarDesativados, salaoId, nome } =
      req.query;
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
            mostrarDesativados === "true",
            salaoId ? String(salaoId) : undefined,
            nome ? String(nome) : undefined,
          );
          if (!cabeleireiros) {
            res.status(404).send("Cabeleireiros not found");
          } else if (cabeleireiros.length === 0) {
            res.status(204).send("No cabeleireiros found");
          } else {
            res.status(200).send(cabeleireiros);
          }
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
      if (!page || !limit || !salaoId) {
        res.status(400).send(
          "Page, limit, and salaoId parameters are required",
        );
        return;
      }
      let cabeleireiros = await getCabeleireiroNomesPage(
        Number(page),
        Number(limit),
        String(salaoId),
        nome ? String(nome) : undefined,
      );
      if (!cabeleireiros) {
        res.status(404).send("Cabeleireiros not found");
      } else if (cabeleireiros.length === 0) {
        res.status(204).send("No cabeleireiros found");
      } else {
        res.status(200).send(cabeleireiros);
      }
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
        const result = await deleteCabeleireiro(id);
        res.status(200).json({
          status: result.status,
          message: result.message,
          details: result.details || {},
        });
      } catch (e: any) {
        console.log(e);
        res.status(500).json({
          status: "ERRO",
          message: e.message || "Error deleting Cabeleireiros",
        });
      }
    }
  },
);

RoutesCabeleireiro.put("/cabeleireiro", async (req: Request, res: Response) => {
  let { ID, CPF, Nome, Email, Telefone, Mei, SalaoId, Password } = req.body;
  try {
    if (
      !Nome ||
      !CPF ||
      !Email ||
      !Telefone ||
      !SalaoId
    ) {
      res.status(400).send("Missing required fields");
      return;
    }
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
      let cabeleireiroBackup = await getCabeleireiroById(
        ID,
        false,
      );
      if (!cabeleireiroBackup) {
        res.status(404).json({ message: "Cabeleireiro not found" });
        return;
      }
      let cabeleireiro = await updateCabeleireiro(
        Email,
        CPF,
        Telefone,
        SalaoId,
        Mei,
        Nome,
        ID,
      );
      if (!cabeleireiro) {
        res.status(404).json({ message: "Cabeleireiro not found" });
        return;
      } else if (Password || Email) {
        const result = await updateLoginPassword(
          cabeleireiro.ID!,
          Password,
          cabeleireiro.SalaoId,
          Email,
        );
        if (result.success) {
          res.status(200).send(cabeleireiro);
          return;
        } else {
          let updateCorrecao = await updateCabeleireiro(
            cabeleireiroBackup.Email,
            cabeleireiroBackup.CPF,
            cabeleireiroBackup.Telefone,
            cabeleireiroBackup.SalaoId,
            cabeleireiroBackup.Mei,
            cabeleireiroBackup.Nome,
            cabeleireiroBackup.ID,
          );
          if (!updateCorrecao) {
            res.status(404).json({
              message: "Erro ao atualizar cabeleireiro, correções falharam",
            });
            return;
          }
          res.status(204).send("Error registering login for Cabeleireiro");
          return;
        }
      }
      res.status(200).send(cabeleireiro);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Error updating Cabeleireiros");
  }
});

export default RoutesCabeleireiro;
