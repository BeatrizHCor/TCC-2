import { Request, Response, Router } from "express";
import {
  CabeleireiroDeleteAgendamento,
  CabeleireirogetAgendamentoById,
  CabeleireirogetAgendamentosPage,
  CabeleireiroPostAgendamento,
  CabeleireiroUpdateAgendamento,
  ClienteDeleteAgendamento,
  ClientegetAgendamentoById,
  ClientegetAgendamentosPage,
  ClientePostAgendamento,
  ClienteUpdateAgendamento,
  FuncionarioDeleteAgendamento,
  FuncionariogetAgendamentoById,
  FuncionariogetAgendamentosPage,
  FuncionarioPostAgendamento,
  FuncionarioUpdateAgendamento,
  getHorariosOcupadosFuturos,
} from "../services/ServiceAgendamento";
import { authenticate } from "../services/Service";
import { userTypes } from "../models/tipo-usuario.enum";
import { getUserInfoAndAuth } from "../utils/FazerAutenticacaoEGetUserInfo";

const RoutesAgendamento = Router();
//-----Funcionario
RoutesAgendamento.post(
  "/funcionario/agendamento",
  async (req: Request, res: Response): Promise<void> => {
    const { Data, ClienteID, SalaoId, CabeleireiroID } = req.body;
    const { servicosIds } = req.body;
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
          const agendamento = await FuncionarioPostAgendamento(
            Data,
            ClienteID,
            CabeleireiroID,
            SalaoId,
            servicosIds
          );

          if (agendamento) {
            res.status(201).json(agendamento);
          } else {
            throw new Error("Erro no ao criar agendamento");
          }
        } else {
          res.status(403).json({
            message: "Não autorizado a fazer esta chamada",
          });
        }
      }
    } catch (erro) {
      console.log(erro);
      res.status(500).send("Erro no ao criar agendamento");
    }
  }
);
RoutesAgendamento.put(
  "/funcionario/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Data, Status, ClienteID, CabeleireiroID, SalaoId, servicosIds } =
      req.body;
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
          const agendamento = await FuncionarioUpdateAgendamento(
            id,
            Data,
            Status,
            ClienteID,
            CabeleireiroID,
            SalaoId,
            servicosIds
          );
          if (agendamento) {
            res.status(200).json(agendamento);
          } else {
            res.status(404).send("falha ao fazer update de Agendamento");
          }
        } else {
          res.status(403).json({
            message: "Não autorizado a fazer esta chamada",
          });
        }
      }
    } catch (erro) {
      console.error("Erro ao atualizar agendamento por ID:", erro);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);
RoutesAgendamento.get(
  "/funcionario/agendamento/page",
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
          const agendamentos = await FuncionariogetAgendamentosPage(
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

RoutesAgendamento.get(
  "/funcionario/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
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
          const agendamento = await FuncionariogetAgendamentoById(
            id,
            includeRelations
          );

          if (agendamento) {
            console.log("teste: ", agendamento);
            res.status(200).json(agendamento);
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
      console.error("Erro ao buscar agendamento por ID:", erro);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);
RoutesAgendamento.delete(
  "/funcionario/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
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
          const deleted = await FuncionarioDeleteAgendamento(id);
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

//-----Cabeleireiro
RoutesAgendamento.post(
  "/cabeleireiro/agendamento",
  async (req: Request, res: Response) => {
    const { Data, ClienteID, SalaoId, CabeleireiroID } = req.body;
    const { ServicoId } = req.body;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
        return;
      } else {
        if (
          auth &&
          [
            userTypes.CABELEIREIRO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const agendamento = await CabeleireiroPostAgendamento(
            Data,
            ClienteID,
            CabeleireiroID,
            SalaoId,
            ServicoId
          );

          if (agendamento) {
            res.status(201).json(agendamento);
          } else {
            throw new Error("Erro no ao criar agendamento");
          }
        } else {
          res.status(403).json({
            message: "Não autorizado a fazer esta chamada",
          });
        }
      }
    } catch (erro) {
      console.log(erro);
      res.status(500).send("Erro no ao criar agendamento");
    }
  }
);
RoutesAgendamento.put(
  "/cabeleireiro/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Data, Status, ClienteID, CabeleireiroID, SalaoId, servicosIds } =
      req.body;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
        return;
      } else {
        if (
          auth &&
          [
            userTypes.CABELEIREIRO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const agendamento = await CabeleireiroUpdateAgendamento(
            id,
            Data,
            Status,
            ClienteID,
            CabeleireiroID,
            SalaoId,
            servicosIds
          );
          if (agendamento) {
            res.status(200).json(agendamento);
          } else {
            res.status(404).send("falha ao fazer update de Agendamento");
          }
        } else {
          res.status(403).json({
            message: "Não autorizado a fazer esta chamada",
          });
        }
      }
    } catch (erro) {
      console.error("Erro ao atualizar agendamento por ID:", erro);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);
RoutesAgendamento.get(
  "/cabeleireiro/agendamento/page",
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
            userTypes.CABELEIREIRO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const agendamentos = await CabeleireirogetAgendamentosPage(
            page,
            limit,
            includeRelations,
            salaoId,
            userInfo.userID,
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

RoutesAgendamento.get(
  "/cabeleireiro/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
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
            userTypes.CABELEIREIRO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const agendamento = await CabeleireirogetAgendamentoById(
            id,
            includeRelations
          );

          if (agendamento) {
            res.status(200).json(agendamento);
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
      console.error("Erro ao buscar agendamento por ID:", erro);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);
RoutesAgendamento.delete(
  "/cabeleireiro/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
      } else {
        if (
          auth &&
          [
            userTypes.CABELEIREIRO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const deleted = await CabeleireiroDeleteAgendamento(id);
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

//-----Cliente
RoutesAgendamento.post(
  "/cliente/agendamento",
  async (req: Request, res: Response) => {
    const { Data, ClienteID, SalaoId, CabeleireiroID } = req.body;
    const { ServicoId } = req.body;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
        return;
      } else {
        if (
          auth &&
          [
            userTypes.CLIENTE,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const agendamento = await ClientePostAgendamento(
            Data,
            ClienteID,
            CabeleireiroID,
            SalaoId,
            ServicoId
          );

          if (agendamento) {
            res.status(201).json(agendamento);
          } else {
            throw new Error("Erro no ao criar agendamento");
          }
        } else {
          res.status(403).json({
            message: "Não autorizado a fazer esta chamada",
          });
        }
      }
    } catch (erro) {
      console.log(erro);
      res.status(500).send("Erro no ao criar agendamento");
    }
  }
);
RoutesAgendamento.put(
  "/cliente/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Data, Status, ClienteID, CabeleireiroID, SalaoId, servicosIds } =
      req.body;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
        return;
      } else {
        if (
          auth &&
          [
            userTypes.CLIENTE,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const agendamento = await ClienteUpdateAgendamento(
            id,
            Data,
            Status,
            ClienteID,
            CabeleireiroID,
            SalaoId,
            servicosIds
          );
          if (agendamento) {
            res.status(200).json(agendamento);
          } else {
            res.status(404).send("falha ao fazer update de Agendamento");
          }
        } else {
          res.status(403).json({
            message: "Não autorizado a fazer esta chamada",
          });
        }
      }
    } catch (erro) {
      console.error("Erro ao atualizar agendamento por ID:", erro);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);
RoutesAgendamento.get(
  "/cliente/agendamento/page",
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
            userTypes.CLIENTE,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const agendamentos = await ClientegetAgendamentosPage(
            page,
            limit,
            includeRelations,
            salaoId,
            userInfo.userID,
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
RoutesAgendamento.get(
  "/cliente/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
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
            userTypes.CLIENTE,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const agendamento = await ClientegetAgendamentoById(
            id,
            includeRelations
          );

          if (agendamento) {
            res.status(200).json(agendamento);
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
      console.error("Erro ao buscar agendamento por ID:", erro);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);

RoutesAgendamento.delete(
  "/cliente/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
      } else {
        if (
          auth &&
          [
            userTypes.CLIENTE,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          const deleted = await ClienteDeleteAgendamento(id);
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

RoutesAgendamento.get(
  "/agendamento/horarios/:salaoId/:cabeleireiroId",
  async (req: Request, res: Response) => {
    const { salaoId, cabeleireiroId } = req.params;
    const { data } = req.query;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (!userInfo) {
        res.status(403).json({ message: "Não autorizado" });
      } else {
        if (
          auth &&
          [
            userTypes.CLIENTE,
            userTypes.FUNCIONARIO,
            userTypes.CABELEIREIRO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userInfo.userType)
        ) {
          if (!salaoId || !cabeleireiroId || !data) {
            res.status(400).json({
              message:
                "Parâmetros obrigatórios: salaoId, cabeleireiroId e data.",
            });
          }
          const horarios = await getHorariosOcupadosFuturos(
            salaoId,
            cabeleireiroId,
            String(data)
          );
          if (horarios !== false) {
            res.status(200).json(horarios);
          } else {
            throw new Error("Erro ao buscar horários ocupados futuros");
          }
        } else {
          res
            .status(403)
            .json({ message: "Não autorizado a fazer esta chamada" });
        }
      }
    } catch (erro) {
      console.error("Erro ao buscar horários ocupados futuros:", erro);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);
export default RoutesAgendamento;
