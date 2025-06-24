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
      console.log("🔐 AUTH DEBUG - userStr do localStorage:", userStr);
      
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log("🔐 AUTH DEBUG - user objeto parseado:", user);
        
        if (user.token) {
          headers['Authorization'] = `Bearer ${user.token}`;
          console.log("🔐 AUTH DEBUG - Token adicionado aos headers");
        } else {
          console.log("❌ AUTH DEBUG - Token não encontrado no user");
        }
        
        if (user.userId || user.userID) {
          headers['X-User-Id'] = user.userId || user.userID;
          console.log("🔐 AUTH DEBUG - User ID adicionado:", user.userId || user.userID);
        } else {
          console.log("❌ AUTH DEBUG - User ID não encontrado");
        }
        
        if (user.userType) {
          headers['X-User-Type'] = user.userType;
          console.log("🔐 AUTH DEBUG - User Type adicionado:", user.userType);
        } else {
          console.log("❌ AUTH DEBUG - User Type não encontrado");
        }
      } else {
        console.log("❌ AUTH DEBUG - Nenhum usuário encontrado no localStorage");
      }
    } catch (error) {
      console.error('❌ AUTH DEBUG - Erro ao obter dados do localStorage:', error);
    }

    console.log('🔐 AUTH DEBUG - Headers finais sendo enviados:', headers);
    return headers;
  }

  async saveSimulation(request: SaveSimulationRequest): Promise<SaveSimulationResponse> {
    console.log("💾 SAVE DEBUG - Iniciando saveSimulation com request:", request);
    
    try {
      const limparBase64 = (str: string) => str.replace(/^data:image\/\w+;base64,/, '');

      console.log("🖼️ SAVE DEBUG - Limpando base64 das imagens...");
      const imagensLimpa = {
        original: limparBase64(request.resultados.images.original),
        analoga_1: limparBase64(request.resultados.images.analoga_1),
        analoga_2: limparBase64(request.resultados.images.analoga_2),
        complementar: limparBase64(request.resultados.images.complementar),
      };

      console.log("🖼️ SAVE DEBUG - Imagens após limpeza (primeiros 50 chars):");
      Object.entries(imagensLimpa).forEach(([key, value]) => {
        console.log(`- ${key}: ${value.substring(0, 50)}...`);
      });

      const payload = {
        clienteId: request.clienteId,
        salaoId: this.defaultSalaoId,
        corOriginal: request.resultados.cor_original,
        cores: request.resultados.cores,
        imagens: imagensLimpa,
      };

      console.log("📦 SAVE DEBUG - Payload completo sendo enviado:", {
        ...payload,
        imagens: Object.keys(payload.imagens) // Só mostra as chaves das imagens
      });

      const headers = this.getAuthHeaders();
      const url = `${this.gatewayUrl}/historico-simulacao`;
      
      console.log("🌐 SAVE DEBUG - URL da requisição:", url);
      console.log("📡 SAVE DEBUG - Fazendo POST request...");

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      console.log("📡 SAVE DEBUG - Resposta recebida:");
      console.log("- Status:", response.status);
      console.log("- Status Text:", response.statusText);
      console.log("- Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ SAVE DEBUG - Erro na resposta HTTP:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ SAVE DEBUG - Dados da resposta de sucesso:", data);

      return {
        success: true,
        data: {
          historicoId: data.historicoId,
          message: data.message || 'Simulação salva com sucesso!',
        },
      };
    } catch (error: any) {
      console.error('❌ SAVE DEBUG - Erro ao salvar simulação:', error);
      return {
        success: false,
        error: `Erro ao salvar simulação: ${error.message}`,
      };
    }
  }

  async getHistoricoCliente(clienteId: string): Promise<GetHistoricoResponse> {
    console.log("🔍 GET CLIENT DEBUG - Iniciando getHistoricoCliente");
    console.log("🔍 GET CLIENT DEBUG - clienteId recebido:", clienteId);
    console.log("🔍 GET CLIENT DEBUG - Tipo do clienteId:", typeof clienteId);
    
    if (!clienteId) {
      console.error("❌ GET CLIENT DEBUG - clienteId está vazio/null/undefined");
      return {
        success: false,
        error: "ID do cliente é obrigatório"
      };
    }

    try {
      const headers = this.getAuthHeaders();
      const url = `${this.gatewayUrl}/historico/cliente/${clienteId}`;
      
      console.log("🌐 GET CLIENT DEBUG - URL da requisição:", url);
      console.log("📡 GET CLIENT DEBUG - Headers da requisição:", headers);
      console.log("📡 GET CLIENT DEBUG - Fazendo GET request...");
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      console.log("📡 GET CLIENT DEBUG - Resposta HTTP recebida:");
      console.log("- Status:", response.status);
      console.log("- Status Text:", response.statusText);
      console.log("- OK:", response.ok);
      console.log("- Headers da resposta:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ GET CLIENT DEBUG - Erro na resposta HTTP:", {
          status: response.status,
          statusText: response.statusText,
          errorText,
          url: url
        });
        
        // Tentar parse do erro se for JSON
        try {
          const errorJson = JSON.parse(errorText);
          console.error("❌ GET CLIENT DEBUG - Erro parseado como JSON:", errorJson);
        } catch (e) {
          console.error("❌ GET CLIENT DEBUG - Erro não é JSON válido");
        }
        
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log("📝 GET CLIENT DEBUG - Texto bruto da resposta:", responseText);
      console.log("📝 GET CLIENT DEBUG - Tamanho da resposta:", responseText.length);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("✅ GET CLIENT DEBUG - JSON parseado com sucesso");
      } catch (parseError) {
        console.error("❌ GET CLIENT DEBUG - Erro ao fazer parse do JSON:", parseError);
        console.error("❌ GET CLIENT DEBUG - Texto que causou o erro:", responseText);
        throw new Error("Resposta da API não é um JSON válido");
      }
      
      console.log("📥 GET CLIENT DEBUG - Estrutura dos dados recebidos:");
      console.log("- Tipo dos dados:", typeof data);
      console.log("- É objeto?", typeof data === 'object' && data !== null);
      console.log("- É array?", Array.isArray(data));
      console.log("- Chaves do objeto:", Object.keys(data || {}));
      
      if (data) {
        if ('success' in data) {
          console.log("- Propriedade 'success':", data.success);
          console.log("- Tipo de 'success':", typeof data.success);
        } else {
          console.log("- Propriedade 'success' NÃO encontrada");
        }
        
        if ('data' in data) {
          console.log("- Propriedade 'data' encontrada");
          console.log("- Tipo de 'data':", typeof data.data);
          console.log("- 'data' é array?:", Array.isArray(data.data));
          
          if (Array.isArray(data.data)) {
            console.log("- Tamanho do array 'data':", data.data.length);
            
            if (data.data.length > 0) {
              console.log("📋 GET CLIENT DEBUG - Primeiro item do histórico:");
              const firstItem = data.data[0];
              console.log("- ID:", firstItem.ID);
              console.log("- Data:", firstItem.Data);
              console.log("- ClienteID:", firstItem.ClienteID);
              console.log("- SalaoId:", firstItem.SalaoId);
              console.log("- Propriedade 'imagens':", firstItem.imagens);
              console.log("- Tipo de 'imagens':", typeof firstItem.imagens);
              console.log("- 'imagens' é array?:", Array.isArray(firstItem.imagens));
              
              if (Array.isArray(firstItem.imagens)) {
                console.log("- Quantidade de imagens:", firstItem.imagens.length);
                firstItem.imagens.forEach((img: any, index: number) => {
                  console.log(`  Imagem ${index + 1}:`, {
                    ID: img.ID,
                    Endereco: img.Endereco,
                    Descricao: img.Descricao,
                    Tipo: img.Tipo
                  });
                });
              } else if (firstItem.imagens) {
                console.log("❌ GET CLIENT DEBUG - 'imagens' existe mas não é array:", firstItem.imagens);
              } else {
                console.log("❌ GET CLIENT DEBUG - 'imagens' é null/undefined");
              }
              
              console.log("📋 GET CLIENT DEBUG - Todos os IDs encontrados:", 
                data.data.map((item: any) => item.ID));
            } else {
              console.log("⚠️ GET CLIENT DEBUG - Array 'data' está vazio");
            }
          } else if (data.data) {
            console.log("❌ GET CLIENT DEBUG - 'data' existe mas não é array:", data.data);
          } else {
            console.log("⚠️ GET CLIENT DEBUG - 'data' é null/undefined");
          }
        } else {
          console.log("❌ GET CLIENT DEBUG - Propriedade 'data' NÃO encontrada");
        }
        
        if ('error' in data) {
          console.log("- Propriedade 'error':", data.error);
        }
        
        if ('message' in data) {
          console.log("- Propriedade 'message':", data.message);
        }
      }
      
      console.log("📋 GET CLIENT DEBUG - Dados completos (JSON stringified):", 
        JSON.stringify(data, null, 2));

      // Verificar se temos dados válidos para retornar
      if (data && (data.success !== false)) {
        const historicoData = data.data || data || [];
        console.log("✅ GET CLIENT DEBUG - Retornando dados:", {
          success: true,
          dataLength: Array.isArray(historicoData) ? historicoData.length : 'not array',
          dataType: typeof historicoData
        });
        
        return {
          success: true,
          data: Array.isArray(historicoData) ? historicoData : [],
        };
      } else {
        console.log("❌ GET CLIENT DEBUG - Dados indicam falha:", data);
        return {
          success: false,
          error: data.error || data.message || "Erro desconhecido na resposta da API"
        };
      }
      
    } catch (error: any) {
      console.error('❌ GET CLIENT DEBUG - Erro inesperado:', error);
      console.error('❌ GET CLIENT DEBUG - Stack trace:', error.stack);
      return {
        success: false,
        error: `Erro ao buscar histórico: ${error.message}`,
      };
    }
  }

  async getHistoricoSalao(salaoId: string): Promise<GetHistoricoResponse> {
    console.log("🏢 GET SALAO DEBUG - Iniciando getHistoricoSalao");
    console.log("🏢 GET SALAO DEBUG - salaoId recebido:", salaoId);
    
    if (!salaoId) {
      console.error("❌ GET SALAO DEBUG - salaoId está vazio");
      return {
        success: false,
        error: "ID do salão é obrigatório"
      };
    }

    try {
      const headers = this.getAuthHeaders();
      const url = `${this.gatewayUrl}/historico/salao/${salaoId}`;
      
      console.log("🌐 GET SALAO DEBUG - URL:", url);
      console.log("📡 GET SALAO DEBUG - Fazendo GET request...");
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      console.log("📡 GET SALAO DEBUG - Status da resposta:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ GET SALAO DEBUG - Erro HTTP:", {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("📥 GET SALAO DEBUG - Dados recebidos:", data);
      console.log("📥 GET SALAO DEBUG - Tipo dos dados:", typeof data);
      console.log("📥 GET SALAO DEBUG - É array?", Array.isArray(data));
      
      if (data && data.data) {
        console.log("📥 GET SALAO DEBUG - data.data:", data.data);
        console.log("📥 GET SALAO DEBUG - Tamanho de data.data:", data.data.length);
      }

      return {
        success: true,
        data: data.data || data || [],
      };
    } catch (error: any) {
      console.error('❌ GET SALAO DEBUG - Erro:', error);
      return {
        success: false,
        error: `Erro ao buscar histórico do salão: ${error.message}`,
      };
    }
  }

  async deleteSimulation(historicoId: string): Promise<{ success: boolean; error?: string }> {
    console.log("🗑️ DELETE DEBUG - Iniciando deleteSimulation");
    console.log("🗑️ DELETE DEBUG - historicoId:", historicoId);
    
    try {
      const headers = this.getAuthHeaders();
      const url = `${this.gatewayUrl}/historico/simulacao/${historicoId}`;
      
      console.log("🌐 DELETE DEBUG - URL:", url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers,
      });

      console.log("📡 DELETE DEBUG - Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ DELETE DEBUG - Erro:", errorText);
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      console.log("✅ DELETE DEBUG - Sucesso");
      return { success: true };
    } catch (error: any) {
      console.error('❌ DELETE DEBUG - Erro:', error);
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
    console.log("🔍 GET BY ID DEBUG - Iniciando getSimulationById");
    console.log("🔍 GET BY ID DEBUG - historicoId:", historicoId);
    
    try {
      const headers = this.getAuthHeaders();
      const url = `${this.gatewayUrl}/historico/simulacao/${historicoId}`;
      
      console.log("🌐 GET BY ID DEBUG - URL:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      console.log("📡 GET BY ID DEBUG - Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ GET BY ID DEBUG - Erro:", errorText);
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("📥 GET BY ID DEBUG - Dados:", data);

      return {
        success: true,
        data: data.simulacao || data,
      };
    } catch (error: any) {
      console.error('❌ GET BY ID DEBUG - Erro:', error);
      return {
        success: false,
        error: `Erro ao buscar simulação: ${error.message}`,
      };
    }
  }

  getImagemUrl(relativoOuCompleto: string): string {
    console.log("🖼️ IMAGE URL DEBUG - Input:", relativoOuCompleto);

    if (!relativoOuCompleto) {
      console.log("❌ IMAGE URL DEBUG - Input vazio, retornando string vazia");
      return '';
    }

    if (relativoOuCompleto.startsWith('http')) {
      console.log("✅ IMAGE URL DEBUG - URL completa detectada, retornando:", relativoOuCompleto);
      return relativoOuCompleto;
    }

    // Use VITE_IMAGEM_URL (onde as imagens realmente estão hospedadas)
    const imagemUrl = import.meta.env.VITE_IMAGEM_URL || 'http://localhost:4000';
    const fullUrl = `${imagemUrl}${relativoOuCompleto.startsWith('/') ? '' : '/'}${relativoOuCompleto}`;

    console.log("🔗 IMAGE URL DEBUG - URL relativa convertida para:", fullUrl);
    return fullUrl;
  }
} // This closes the HistoricoSimulacaoService class

// Now these exports are outside the class
export const HistoricoService = new HistoricoSimulacaoService();
export const getImagemUrl = HistoricoService.getImagemUrl.bind(HistoricoService);