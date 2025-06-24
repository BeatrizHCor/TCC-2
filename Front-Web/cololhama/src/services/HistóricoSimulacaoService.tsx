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
  private readonly defaultSalaoId = import.meta.env.VITE_SALAO_ID || '1';

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    try {
      const userStr = localStorage.getItem("usuario");
      
      if (userStr) {
        const user = JSON.parse(userStr);
        
        if (user.token) {
          headers['Authorization'] = `Bearer ${user.token}`;
        }
        
        if (user.userId || user.userID) {
          headers['X-User-Id'] = user.userId || user.userID;
        }
        
        if (user.userType) {
          headers['X-User-Type'] = user.userType;
        }
      }
    } catch (error) {
      console.error('Erro ao obter dados do localStorage:', error);
    }

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
        salaoId: this.defaultSalaoId,
        corOriginal: request.resultados.cor_original,
        cores: request.resultados.cores,
        imagens: imagensLimpa,
      };

      const headers = this.getAuthHeaders();
      const url = `${this.gatewayUrl}/historico-simulacao`;

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
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
      return {
        success: false,
        error: `Erro ao salvar simulação: ${error.message}`,
      };
    }
  }

  async getHistoricoCliente(clienteId: string): Promise<GetHistoricoResponse> {
    if (!clienteId) {
      return {
        success: false,
        error: "ID do cliente é obrigatório"
      };
    }

    try {
      const headers = this.getAuthHeaders();
      const url = `${this.gatewayUrl}/historico/cliente/${clienteId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Resposta da API não é um JSON válido");
      }

      if (data && (data.success !== false)) {
        const historicoData = data.data || data || [];
        
        return {
          success: true,
          data: Array.isArray(historicoData) ? historicoData : [],
        };
      } else {
        return {
          success: false,
          error: data.error || data.message || "Erro desconhecido na resposta da API"
        };
      }
      
    } catch (error: any) {
      return {
        success: false,
        error: `Erro ao buscar histórico: ${error.message}`,
      };
    }
  }

  async getHistoricoSalao(salaoId: string): Promise<GetHistoricoResponse> {
    if (!salaoId) {
      return {
        success: false,
        error: "ID do salão é obrigatório"
      };
    }

    try {
      const headers = this.getAuthHeaders();
      const url = `${this.gatewayUrl}/historico/salao/${salaoId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data.data || data || [],
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Erro ao buscar histórico do salão: ${error.message}`,
      };
    }
  }

  async deleteSimulation(historicoId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const headers = this.getAuthHeaders();
      const url = `${this.gatewayUrl}/historico/simulacao/${historicoId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      return { success: true };
    } catch (error: any) {
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
      const headers = this.getAuthHeaders();
      const url = `${this.gatewayUrl}/historico/simulacao/${historicoId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data.simulacao || data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Erro ao buscar simulação: ${error.message}`,
      };
    }
  }

  getImagemUrl(relativoOuCompleto: string): string {
    if (!relativoOuCompleto) {
      return '';
    }

    if (relativoOuCompleto.startsWith('http')) {
      return relativoOuCompleto;
    }

    const imagemUrl = import.meta.env.VITE_IMAGEM_URL || 'http://localhost:4000';
    const fullUrl = `${imagemUrl}${relativoOuCompleto.startsWith('/') ? '' : '/'}${relativoOuCompleto}`;

    return fullUrl;
  }
}

export const HistoricoService = new HistoricoSimulacaoService();
export const getImagemUrl = HistoricoService.getImagemUrl.bind(HistoricoService);