import { Router, Request, Response } from "express";
import axios from "axios";
import { getUserInfoAndAuth } from "../utils/FazerAutenticacaoEGetUserInfo";
import { userTypes } from "../models/tipo-usuario.enum";

const routerHistoricoSimulacao = Router();

const HISTORICO_URL = process.env.VITE_IMAGEM_URL || "http://localhost:4000"; 

routerHistoricoSimulacao.post("/historico-simulacao", async (req: Request, res: Response): Promise<void> => {
  try {
    const userTypeHeader = req.headers['x-user-type'] as string;
    const userIdHeader = req.headers['x-user-id'] as string;
    const authToken = req.headers['authorization'];

    if (userTypeHeader && userIdHeader && authToken) {
      if (userTypeHeader !== 'Cliente') {
        res.status(403).json({ 
          error: "Apenas clientes podem salvar simulações",
          debug: {
            userType: userTypeHeader,
            expectedType: 'Cliente'
          }
        });
        return;
      }

      try {
        const enrichedBody = {
          ...req.body,
          userId: userIdHeader,
          userType: userTypeHeader,
          clienteId: req.body.clienteId || userIdHeader
        };

        const result = await axios.post(`${HISTORICO_URL}/historico-simulacao`, enrichedBody, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": authToken,
            "X-User-Type": userTypeHeader,
            "X-User-Id": userIdHeader
          },
          timeout: 30000
        });

        res.status(result.status).json(result.data);
        return;

      } catch (axiosError: any) {
        res.status(axiosError.response?.status || 500).json({ 
          error: "Erro na comunicação com serviço de histórico",
          details: {
            status: axiosError.response?.status,
            message: axiosError.message,
            data: axiosError.response?.data
          },
          suggestion: "Verifique se o serviço de histórico está rodando na porta 4000"
        });
        return;
      }
    }

    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);

      if (!auth) {
        res.status(403).json({ error: "Usuário não autenticado" });
        return;
      }

      if (!userInfo) {
        res.status(403).json({ error: "Informações do usuário não encontradas" });
        return;
      }

      if (userInfo.userType !== userTypes.CLIENTE) {
        res.status(403).json({ 
          error: "Apenas clientes podem salvar simulações",
          debug: {
            userType: userInfo.userType,
            expectedType: userTypes.CLIENTE,
            comparison: userInfo.userType === userTypes.CLIENTE
          }
        });
        return;
      }

      try {
        const enrichedBody = {
          ...req.body,
          userId: userInfo.userID,
          userType: userInfo.userType,
          clienteId: req.body.clienteId || userInfo.userID
        };

        const result = await axios.post(`${HISTORICO_URL}/historico-simulacao`, enrichedBody, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": req.headers.authorization
          },
          timeout: 30000
        });

        res.status(result.status).json(result.data);

      } catch (axiosError: any) {
        res.status(axiosError.response?.status || 500).json({ 
          error: "Erro na comunicação com serviço de histórico",
          details: {
            status: axiosError.response?.status,
            message: axiosError.message,
            data: axiosError.response?.data
          }
        });
      }

    } catch (authError: any) {
      res.status(403).json({ 
        error: "Erro na autenticação", 
        details: authError.message,
        suggestion: "Verifique se o token está válido"
      });
    }

  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro interno ao salvar histórico", 
      details: error.message,
      suggestion: "Verifique os logs do servidor para mais detalhes"
    });
  }
});

routerHistoricoSimulacao.get("/historico/cliente/:clienteId", async (req: Request, res: Response) => {
  const { clienteId } = req.params;

  try {
    const result = await axios.get(`${HISTORICO_URL}/historico/cliente/${clienteId}`);
    res.status(result.status).json(result.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: "Erro ao buscar histórico de cliente via gateway",
      details: error.response?.data || error.message,
    });
  }
});

routerHistoricoSimulacao.delete("/historico/simulacao/:historicoId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { historicoId } = req.params;
    
    if (!historicoId) {
      res.status(400).json({ error: "ID do histórico é obrigatório" });
      return;
    }

    const userTypeHeader = req.headers['x-user-type'] as string;
    const userIdHeader = req.headers['x-user-id'] as string;
    const authToken = req.headers['authorization'];

    if (userTypeHeader && userIdHeader && authToken) {
      if (userTypeHeader !== 'Cliente') {
        res.status(403).json({ 
          error: "Apenas clientes podem deletar simulações",
          debug: {
            userType: userTypeHeader,
            expectedType: 'Cliente'
          }
        });
        return;
      }

      try {
        const result = await axios.delete(`${HISTORICO_URL}/historico-simulacao/delete/${historicoId}`, {
          headers: {
            "Authorization": authToken,
            "X-User-Type": userTypeHeader,
            "X-User-Id": userIdHeader
          },
          timeout: 30000
        });

        res.status(result.status).json(result.data);
        return;

      } catch (axiosError: any) {
        res.status(axiosError.response?.status || 500).json({ 
          error: "Erro na comunicação com serviço de histórico",
          details: {
            status: axiosError.response?.status,
            message: axiosError.message,
            data: axiosError.response?.data
          },
          suggestion: "Verifique se o serviço de histórico está rodando na porta 4000"
        });
        return;
      }
    }

    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);

      if (!auth) {
        res.status(403).json({ error: "Usuário não autenticado" });
        return;
      }

      if (!userInfo) {
        res.status(403).json({ error: "Informações do usuário não encontradas" });
        return;
      }

      if (userInfo.userType !== userTypes.CLIENTE) {
        res.status(403).json({ 
          error: "Apenas clientes podem deletar simulações",
          debug: {
            userType: userInfo.userType,
            expectedType: userTypes.CLIENTE
          }
        });
        return;
      }

      try {
        const result = await axios.delete(`${HISTORICO_URL}/historico-simulacao/delete/${historicoId}`, {
          headers: {
            "Authorization": req.headers.authorization
          },
          timeout: 30000
        });

        res.status(result.status).json(result.data);

      } catch (axiosError: any) {
        res.status(axiosError.response?.status || 500).json({ 
          error: "Erro na comunicação com serviço de histórico",
          details: {
            status: axiosError.response?.status,
            message: axiosError.message,
            data: axiosError.response?.data
          }
        });
      }

    } catch (authError: any) {
      res.status(403).json({ 
        error: "Erro na autenticação", 
        details: authError.message,
        suggestion: "Verifique se o token está válido"
      });
    }

  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro interno ao deletar histórico", 
      details: error.message,
      suggestion: "Verifique os logs do servidor para mais detalhes"
    });
  }
});

export default routerHistoricoSimulacao;