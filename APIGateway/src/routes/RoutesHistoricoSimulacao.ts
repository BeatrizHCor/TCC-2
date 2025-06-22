import { Router, Request, Response } from "express";
import axios from "axios";
import { getUserInfoAndAuth } from "../utils/FazerAutenticacaoEGetUserInfo";
import { userTypes } from "../models/tipo-usuario.enum";

const routerHistoricoSimulacao = Router();

const HISTORICO_URL = process.env.VITE_IMAGEM_URL || "http://localhost:4000"; 

routerHistoricoSimulacao.post("/historico-simulacao", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("=== DEBUG HISTORICO SIMULACAO ===");
    console.log("Headers recebidos:", req.headers);
    console.log("Body recebido:", JSON.stringify(req.body, null, 2));
    
    // Primeiro, tenta usar os headers customizados se disponíveis
    const userTypeHeader = req.headers['x-user-type'] as string;
    const userIdHeader = req.headers['x-user-id'] as string;
    const authToken = req.headers['authorization'];

    if (userTypeHeader && userIdHeader && authToken) {
      console.log("Usando headers customizados para autenticação:");
      console.log("- userType:", userTypeHeader);
      console.log("- userId:", userIdHeader);
      console.log("- hasToken:", !!authToken);

      // Verifica se é cliente
      if (userTypeHeader !== 'Cliente') {
        console.log(`❌ Tipo de usuário inválido. Esperado: Cliente, Recebido: ${userTypeHeader}`);
        res.status(403).json({ 
          error: "Apenas clientes podem salvar simulações",
          debug: {
            userType: userTypeHeader,
            expectedType: 'Cliente'
          }
        });
        return;
      }

      console.log("✅ Autenticação via headers customizados OK, encaminhando para serviço de histórico");
      console.log("URL do serviço:", `${HISTORICO_URL}/historico-simulacao`);

      try {
        // Adiciona informações do usuário no body para o serviço de histórico
        const enrichedBody = {
          ...req.body,
          userId: userIdHeader,
          userType: userTypeHeader,
          clienteId: req.body.clienteId || userIdHeader // Garantir que clienteId está presente
        };

        console.log("Body enriquecido sendo enviado:", JSON.stringify(enrichedBody, null, 2));

        const result = await axios.post(`${HISTORICO_URL}/historico-simulacao`, enrichedBody, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": authToken,
            "X-User-Type": userTypeHeader,
            "X-User-Id": userIdHeader
          },
          timeout: 30000 // 30 segundos de timeout
        });

        console.log("✅ Resposta do serviço de histórico:", result.status);
        console.log("Dados da resposta:", result.data);
        res.status(result.status).json(result.data);
        return;

      } catch (axiosError: any) {
        console.error("💥 Erro na comunicação com serviço de histórico:");
        console.error("- Status:", axiosError.response?.status);
        console.error("- StatusText:", axiosError.response?.statusText);
        console.error("- Data:", axiosError.response?.data);
        console.error("- Headers:", axiosError.response?.headers);
        console.error("- Config URL:", axiosError.config?.url);
        console.error("- Message:", axiosError.message);

        // Retorna erro mais detalhado
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

    // Fallback para o método original
    console.log("Headers customizados não encontrados, tentando método original...");
    
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      
      console.log("Resultado da autenticação original:");
      console.log("- auth:", auth);
      console.log("- userInfo:", userInfo);
      console.log("- userType:", userInfo?.userType);
      console.log("- userTypes.CLIENTE:", userTypes.CLIENTE);

      if (!auth) {
        console.log("❌ Falha na autenticação - auth = false");
        res.status(403).json({ error: "Usuário não autenticado" });
        return;
      }

      if (!userInfo) {
        console.log("❌ userInfo não encontrado");
        res.status(403).json({ error: "Informações do usuário não encontradas" });
        return;
      }

      if (userInfo.userType !== userTypes.CLIENTE) {
        console.log(`❌ Tipo de usuário inválido. Esperado: ${userTypes.CLIENTE}, Recebido: ${userInfo.userType}`);
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

      console.log("✅ Autenticação original OK, encaminhando para serviço de histórico");

      try {
        // Adiciona informações do usuário no body para o serviço de histórico
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

        console.log("✅ Resposta do serviço de histórico:", result.status);
        res.status(result.status).json(result.data);

      } catch (axiosError: any) {
        console.error("💥 Erro na comunicação com serviço de histórico (método original):");
        console.error("- Status:", axiosError.response?.status);
        console.error("- Data:", axiosError.response?.data);
        console.error("- Message:", axiosError.message);

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
      console.error("💥 Erro na autenticação original:", authError.message);
      res.status(403).json({ 
        error: "Erro na autenticação", 
        details: authError.message,
        suggestion: "Verifique se o token está válido"
      });
    }

  } catch (error: any) {
    console.error("💥 Erro geral ao salvar simulação via gateway:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      error: "Erro interno ao salvar histórico", 
      details: error.message,
      suggestion: "Verifique os logs do servidor para mais detalhes"
    });
  }
});

// Adiciona endpoint para testar conectividade com o serviço de histórico
routerHistoricoSimulacao.get("/test-connection", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Testando conectividade com serviço de histórico...");
    console.log("URL:", `${HISTORICO_URL}/health`);
    
    const result = await axios.get(`${HISTORICO_URL}/health`, {
      timeout: 5000
    });
    
    res.json({
      status: "OK",
      historicoService: {
        url: HISTORICO_URL,
        status: result.status,
        data: result.data
      }
    });
  } catch (error: any) {
    console.error("Erro no teste de conectividade:", error.message);
    res.status(500).json({
      status: "ERROR",
      error: error.message,
      historicoService: {
        url: HISTORICO_URL,
        accessible: false
      }
    });
  }
});

export default routerHistoricoSimulacao;