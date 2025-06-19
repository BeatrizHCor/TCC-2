import { Router, Request, Response } from "express";

import {
  FuncionariogetAtendimentosPage,
  getAtendimentobyAgendamentoId,
  postAtendimento,
} from "../services/ServiceAtendimento";
import { userTypes } from "../models/tipo-usuario.enum";
import { authenticate } from "../services/Service";
import { getUserInfoAndAuth } from "../utils.ts/FazerAutenticacaoEGetUserInfo";

const RoutesAtendimento = Router();

RoutesAtendimento.post("/atendimento", async (req: Request, res: Response) => {
  const {
    Data,
    PrecoTotal,
    Auxiliar,
    SalaoId,
    servicosAtendimento,
    auxiliares,
    AgendamentoID,
  } = req.body;
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
        userTypes.CABELEIREIRO,
        userTypes.FUNCIONARIO,
        userTypes.ADM_SALAO,
        userTypes.ADM_SISTEMA,
      ].includes(userTypeAuth)
    ) {
      res.status(403).json({ message: "Unauthorized" });
    } else {
      const result = await postAtendimento(
        Data,
        PrecoTotal,
        Auxiliar,
        SalaoId,
        servicosAtendimento,
        auxiliares,
        AgendamentoID
      );
      res.status(201).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Erro no ao criar agendamento");
  }
});

RoutesAtendimento.get(
  `/atendimentobyagendamento/:agendamentoId`,
  async (req: Request, res: Response) => {
    let { agendamentoId } = req.params;
    try {
      let atendimento = await getAtendimentobyAgendamentoId(agendamentoId);
      res.status(201).json(atendimento);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error querying Cabeleireiros");
    }
  }
);

RoutesAtendimento.get(
  "/funcionario/atendimento/page",
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const salaoId = parseInt(req.query.salaoId as string) || 0;
    const dia = parseInt(req.query.dia as string) || 0;
    const mes = parseInt(req.query.mes as string) || 0;
    const ano = parseInt(req.query.ano as string) || 0;
    const includeRelations = req.query.includeRelations === "true";
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
        return;
      } else {
        if (
          auth &&
          [
            userTypes.FUNCIONARIO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const agendamentos = await FuncionariogetAtendimentosPage(
            page,
            limit,
            includeRelations,
            salaoId,
            dia,
            mes,
            ano
          );
          if (agendamentos) {
            res.status(200).json(agendamentos);
          } else {
            res.status(204).send();
          }
        } else {
          res.status(403).json({
            message: "Não autorizado a fazer esta chamada",
          });
        }
      }
    } catch (erro) {
      console.error("Erro ao buscar agendamento:", erro);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);

export default RoutesAtendimento;
