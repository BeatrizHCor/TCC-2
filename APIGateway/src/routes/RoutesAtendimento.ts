import { Router, Request, Response } from "express";

import {
  FuncionarioDeleteAtendimento,
  CabeleireirogetAtendimentosPage,
  getAtendimentobyAgendamentoId,
  postAtendimentoFuncionario,
  putAtendimentoCabeleireiro,
  FuncionariogetAtendimentosPage,
  putAtendimentoFuncionario,
  postAtendimentoCabeleireiro,
  CabeleireiroDeleteAtendimento,
  ClientegetAtendimentosPage,
} from "../services/ServiceAtendimento";
import { userTypes } from "../models/tipo-usuario.enum";
import { authenticate } from "../services/Service";
import { getUserInfoAndAuth } from "../utils/FazerAutenticacaoEGetUserInfo";
import { FuncionariogetAgendamentosPage } from "../services/ServiceAgendamento";

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
      if (
        [
          userTypes.FUNCIONARIO,
          userTypes.ADM_SALAO,
          userTypes.ADM_SISTEMA,
        ].includes(userTypeAuth)
      ) {
        const result = await postAtendimentoFuncionario(
          Data,
          PrecoTotal,
          Auxiliar,
          SalaoId,
          servicosAtendimento,
          auxiliares,
          AgendamentoID
        );
        res.status(201).json(result);
      } else if ([userTypes.CABELEIREIRO].includes(userTypeAuth)) {
        const result = await postAtendimentoCabeleireiro(
          Data,
          PrecoTotal,
          Auxiliar,
          SalaoId,
          servicosAtendimento,
          auxiliares,
          AgendamentoID
        );
        res.status(201).json(result);
      } else {
        res.status(403).json({ message: "Unauthorized" });
      }
    }
  } catch (e) {
    console.log(e);
    console.log("aqui terceiro");

    res.status(500).send("Erro no ao criar atendimento");
  }
});

RoutesAtendimento.put(
  "/atendimento/:atendimentoId",
  async (req: Request, res: Response) => {
    const {
      Data,
      PrecoTotal,
      Auxiliar,
      SalaoId,
      servicosAtendimento,
      auxiliares,
      AgendamentoID,
      status,
    } = req.body;
    const { atendimentoId } = req.params;
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
        if (
          [
            userTypes.FUNCIONARIO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userTypeAuth)
        ) {
          const result = await putAtendimentoFuncionario(
            atendimentoId as string,
            Data,
            PrecoTotal,
            Auxiliar,
            SalaoId,
            servicosAtendimento,
            auxiliares,
            AgendamentoID,
            status
          );
          res.status(201).json(result);
        } else if ([userTypes.CABELEIREIRO].includes(userTypeAuth)) {
          const result = await putAtendimentoCabeleireiro(
            atendimentoId as string,
            Data,
            PrecoTotal,
            Auxiliar,
            SalaoId,
            servicosAtendimento,
            auxiliares,
            AgendamentoID,
            status
          );
          res.status(201).json(result);
        } else {
          res.status(403).json("Unauthorized");
        }
      }
    } catch (e) {
      console.log(e);

      res.status(500).send("Erro no ao atualizar atendimento");
    }
  }
);

RoutesAtendimento.get(
  `/atendimentobyagendamento/:agendamentoId`,
  async (req: Request, res: Response) => {
    let { agendamentoId } = req.params;
    console.log(agendamentoId);
    try {
      let atendimento = await getAtendimentobyAgendamentoId(agendamentoId);
      res.status(201).json(atendimento);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error querying Agendamento");
    }
  }
);

RoutesAtendimento.get(
  "/funcionario/atendimento/page",
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const salaoId = parseInt(req.query.salaoId as string) || 0;
    const data = (req.query.data as string) || "0000-00-00";
    const includeRelations = req.query.includeRelations === "true";
    const cliente = req.query.cliente || null;
    const cabeleireiro = req.query.cabeleireiro || null;
    console;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      console.log(userInfo);
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
            data,
            cliente ? String(cliente) : null,
            cabeleireiro ? String(cabeleireiro) : null
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
RoutesAtendimento.get(
  "/cliente/atendimento/page",
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const salaoId = parseInt(req.query.salaoId as string) || 0;
    const data = (req.query.data as string) || "0000-00-00";
    const includeRelations = req.query.includeRelations === "true";
    const userId = req.query.userId as string;
    const cabeleireiro = req.query.cabeleireiro || null;
    console;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      console.log(userInfo);
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
          const agendamentos = await ClientegetAtendimentosPage(
            page,
            limit,
            includeRelations,
            salaoId,
            data,
            userId,
            cabeleireiro ? String(cabeleireiro) : null
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

RoutesAtendimento.get(
  "/cabeleireiro/atendimento/page",
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const salaoId = parseInt(req.query.salaoId as string) || 0;
    const data = (req.query.data as string) || "0000-00-00";
    const includeRelations = req.query.includeRelations === "true";
    const userId = req.query.userId as string;
    const cliente = req.query.cliente as string;
    console.log(req.query);
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      console.log(userInfo);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
        return;
      } else {
        if (auth && [userTypes.CABELEIREIRO].includes(userInfo.userType)) {
          const agendamentos = await CabeleireirogetAtendimentosPage(
            page,
            limit,
            includeRelations,
            salaoId,
            data,
            userId,
            cliente
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

RoutesAtendimento.delete(
  "/atendimento/:atendimentoId",
  async (req: Request, res: Response) => {
    const { atendimentoId } = req.params;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
      } else {
        if (
          auth &&
          [
            userTypes.FUNCIONARIO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const deleted = await FuncionarioDeleteAtendimento(atendimentoId);
          if (deleted) {
            res.status(204).send();
          } else {
            res.status(404).json({ message: "Agendamento não encontrado" });
          }
        } else if (
          auth &&
          [userTypes.CABELEIREIRO].includes(userInfo.userType)
        ) {
          const deleted = await CabeleireiroDeleteAtendimento(atendimentoId);
          if (deleted) {
            res.status(204).send();
          } else {
            res.status(404).json({ message: "Agendamento não encontrado" });
          }
        } else {
          res.status(403).json({
            message: "Não autorizado a fazer esta chamada",
          });
        }
      }
    } catch (erro) {
      console.error("Erro ao deletar agendamento:", erro);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);

export default RoutesAtendimento;
