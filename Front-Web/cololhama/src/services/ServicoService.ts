import axios from "axios";
import { Servico } from "../models/servicoModel";

const api = axios.create({
  baseURL:  import.meta.env.APIGATEWAY_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// set os dados do usuario para autenticação no header de cada requisição
api.interceptors.request.use(
  (config) => {
    const usuario = localStorage.getItem("usuario"); 
    if (usuario) {
      const { userID, userType } = JSON.parse(usuario); 
      config.headers.userID = userID; 
      config.headers.userType = userType; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// verifique se a resposta contém um novo token e atualiza
api.interceptors.response.use(
  (response) => {
    const tokenHeader = response.headers["authorization"]?.replace("Bearer ", "");
    const currentToken = localStorage.getItem("token");
    if (tokenHeader !== currentToken && currentToken) {
      console.log("Atualizando token na memória local");
      localStorage.setItem("token", tokenHeader);
      axios.defaults.headers.common["Authorization"] = `Bearer ${tokenHeader}`;
    }
    return response;
  },
  (error) => {
    console.error("Erro na resposta da API:", error);
    return Promise.reject(error);
  }
);

interface ServicoPaginadoResponse {
  data: Servico[];
  total: number;
  page: number;
  limit: number;
}

class ServicoService {
  static async getServicosPaginados(
    page: number = 1,
    limit: number = 10,
    salaoId: string,
    nome?: string,
    precoMin: number = 0,
    precoMax: number = 0,
    includeRelations: boolean = false
  ): Promise<ServicoPaginadoResponse> {
    try {
      const response = await api.get(`/servico/page`, {
        params: {
          page,
          limit,
          salaoId,
          nome,
          precoMin,
          precoMax,
          includeRelations,          
        },
      });
      console.log("Serviços recebidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      throw error;
    }
  }

  static async getServicoById(id: string): Promise<Servico> {
    try {
      const response = await api.get(`/servico/ID/${id}`);
      const servico = response.data as Servico;       ;
      return servico;
    } catch (error) {
      console.error(`Erro ao buscar serviço com ID ${id}:`, error);
      throw error;
    }
  }

  static async getServicosBySalao(salaoId: string): Promise<Servico[]> {
    try {
      const response = await api.get(`/servico/salao/${salaoId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviços do salão ${salaoId}:`, error);
      throw error;
    }
  }

  static async createServico(
      Nome: string,
      SalaoId: string,      
      PrecoMin: number = 0,
      PrecoMax: number = 0,
      Descricao: string,
  ): Promise<Servico> {
    try {
      const servicoData: Servico = {
        Nome: Nome,
        SalaoId: SalaoId,    
        PrecoMin: PrecoMin,
        PrecoMax: PrecoMax,
        Descricao: Descricao,
      };
      const response = await api.post(`/servico`, servicoData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      throw error;
    }
  }

  static async updateServico(
    id: string,
    Nome: string,
    SalaoId: string,      
    PrecoMin: number = 0,
    PrecoMax: number = 0,
    Descricao: string,
  ): Promise<Servico> {
    try {   
      const servicoData: Servico = {
        Nome: Nome,
        SalaoId: SalaoId,    
        PrecoMin: PrecoMin,
        PrecoMax: PrecoMax,
        Descricao: Descricao,
      };
      const response = await api.put(`/servico/update/${id}`, servicoData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar serviço com ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteServico(id: string): Promise<void> {
    try {
      const response = await api.delete(`/servico/delete/${id}`);
      if (response.status === 200){
        console.log("Serviço deletedo: ", response.data.Nome)
      }
    } catch (error) {
      console.error(`Erro ao excluir serviço com ID ${id}:`, error);
      throw error;
    }
  }

  static async getServicoByNomeAndSalao(
    nome: string,
    salaoId: string
  ): Promise<Servico> {
    try {
      const response = await api.get(`/servico/nome/${nome}/${salaoId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviço com nome ${nome} do salão ${salaoId}:`, error);
      throw error;
    }
  }

  static async findServicoByNomeAndSalaoId(
    nome: string,
    salaoId: string
  ): Promise<Servico[]> {
    try {
      const response = await api.get(`/servico/find/${nome}/${salaoId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviço com nome ${nome} do salão ${salaoId}:`, error);
      throw error;
    }
  }

}

export default ServicoService;
