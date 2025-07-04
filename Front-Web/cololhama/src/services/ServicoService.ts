import axios from "axios";
import { Servico } from "../models/servicoModel";


const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || "http://localhost:5000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("usuario");
  config.headers = config.headers || {};
  config.headers.Authorization = btoa(token || "");
  return config;
});
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
    includeRelations: boolean = false,
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
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      throw error;
    }
  }

  static async getServicoById(id: string): Promise<Servico | boolean> {
    try {
      const response = await api.get(`/servico/ID/${id}`);
      if (response.status === 403) {
        return false;
      }
      const servico = response.data as Servico;
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
    PrecoMin: number,
    PrecoMax: number,
    Descricao: string,
  ): Promise<Servico> {
    try {
      const response = await api.post(`/servico`, {
        Nome: Nome,
        SalaoId: SalaoId,
        PrecoMin: PrecoMin,
        PrecoMax: PrecoMax,
        Descricao: Descricao,
      });
      if (response.status === 201) {
        return response.data;
      } else {
        return {
          Id: "",
          Nome: "",
          SalaoId: "",
          PrecoMin: 0,
          PrecoMax: 0,
          Descricao: "",
        } as Servico;
      }
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
      const response = await api.put(`/servico/update/${id}`, {
        Nome: Nome,
        SalaoId: SalaoId,
        PrecoMin: PrecoMin,
        PrecoMax: PrecoMax,
        Descricao: Descricao,
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar serviço com ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteServico(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/servico/delete/${id}`);
      if (response.status === 204) {
        console.log("Serviço deletedo");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(`Erro ao excluir serviço com ID ${id}:`, error);
      throw error;
    }
  }

  static async getServicoByNomeAndSalao(
    nome: string,
    salaoId: string,
  ): Promise<Servico> {
    try {
      const response = await api.get(`/servico/nome/${nome}/${salaoId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar serviço com nome ${nome} do salão ${salaoId}:`,
        error,
      );
      throw error;
    }
  }

  static async findServicoByNomeAndSalaoId(
    nome: string,
    salaoId: string,
  ): Promise<Servico[]> {
    try {
      const response = await api.get(`/servico/find/${nome}/${salaoId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar serviço com nome ${nome} do salão ${salaoId}:`,
        error,
      );
      throw error;
    }
  }
}

export default ServicoService;
