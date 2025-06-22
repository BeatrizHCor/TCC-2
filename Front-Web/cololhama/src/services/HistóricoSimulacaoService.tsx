import { ResultsType } from "./IAService";

const limparBase64 = (str: string) => str.replace(/^data:image\/\w+;base64,/, '');

export interface HistoricoSimulacao {
  ID: string;
  Data: Date;
  SalaoId: string | { ID: string; Nome: string };
  ClienteID: string | { ID: string; Nome: string };
  imagens?: ImagemHistorico[];
}

export interface ImagemHistorico {
  ID: string;
  HistoricoSimulacaoId: string;
  Endereco: string;
  Descricao: string;
  Tipo: 'Simulacao';
}

export interface SaveSimulationRequest {
  clienteId: string;
  salaoId: string;
  resultados: ResultsType;
}

export interface SaveSimulationResponse {
  success: boolean;
  data?: {
    historicoId: string;
    message: string;
  };
  error?: string;
}

export interface GetHistoricoResponse {
  success: boolean;
  data?: HistoricoSimulacao[];
  error?: string;
}

class HistoricoSimulacaoService {
  private readonly gatewayUrl = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:5000';

  // Helper method to get auth headers
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Try to get token from localStorage
    try {
      const userStr = localStorage.getItem("usuario");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.token) {
          headers['Authorization'] = `Bearer ${user.token}`;
        }
        // Also add user info directly to headers for debugging
        if (user.userId || user.userID) {
          headers['X-User-Id'] = user.userId || user.userID;
        }
        if (user.userType) {
          headers['X-User-Type'] = user.userType;
        }
      }
    } catch (error) {
      console.error('Erro ao obter token do localStorage:', error);
    }

    console.log('Headers sendo enviados:', headers);
    return headers;
  }

  async saveSimulation(request: SaveSimulationRequest): Promise<SaveSimulationResponse> {
  try {
    const limparBase64 = (str: string) => str.replace(/^data:image\/\w+;base64,/, '');

    const imagensLimpa = {
      original: limparBase64(request.resultados.images.original),
      analoga_1: limparBase64(request.resultados.images.analoga_1),
      analoga_2: limparBase64(request.resultados.images.analoga_2),
      complementar: limparBase64(request.resultados.images.complementar),
    };

    const payload = {
      clienteId: request.clienteId,
      salaoId: "1",
      corOriginal: request.resultados.cor_original,
      cores: request.resultados.cores,
      imagens: imagensLimpa,
    };

    console.log("📦 Payload sendo enviado:", payload);

    const response = await fetch(`${this.gatewayUrl}/historico-simulacao`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: {
        historicoId: data.historicoId,
        message: data.message || 'Simulação salva com sucesso!',
      },
    };
  } catch (error: any) {
    console.error('❌ Erro ao salvar simulação:', error);
    return {
      success: false,
      error: `Erro ao salvar simulação: ${error.message}`,
    };
  }
}


  async getHistoricoCliente(clienteId: string): Promise<GetHistoricoResponse> {
    try {
      const response = await fetch(
        `${this.gatewayUrl}/historico/cliente/${clienteId}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data.historico || [],
      };
    } catch (error: any) {
      console.error('Erro ao buscar histórico:', error);
      return {
        success: false,
        error: `Erro ao buscar histórico: ${error.message}`,
      };
    }
  }

  async getHistoricoSalao(salaoId: string): Promise<GetHistoricoResponse> {
    try {
      const response = await fetch(
        `${this.gatewayUrl}/historico/salao/${salaoId}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data.historico || [],
      };
    } catch (error: any) {
      console.error('Erro ao buscar histórico do salão:', error);
      return {
        success: false,
        error: `Erro ao buscar histórico do salão: ${error.message}`,
      };
    }
  }

  async deleteSimulation(historicoId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `${this.gatewayUrl}/historico/simulacao/${historicoId}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao deletar simulação:', error);
      return {
        success: false,
        error: `Erro ao deletar simulação: ${error.message}`,
      };
    }
  }

  async getSimulationById(historicoId: string): Promise<{
    success: boolean;
    data?: HistoricoSimulacao;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${this.gatewayUrl}/historico/simulacao/${historicoId}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data.simulacao,
      };
    } catch (error: any) {
      console.error('Erro ao buscar simulação:', error);
      return {
        success: false,
        error: `Erro ao buscar simulação: ${error.message}`,
      };
    }
  }
}

export const HistoricoService = new HistoricoSimulacaoService();