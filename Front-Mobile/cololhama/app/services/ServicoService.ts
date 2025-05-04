import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Servico } from "../models/servicoModel";

const API_URL = process.env.EXPO_PUBLIC_API_URL; // Coloquei em um .env . Favor usar .env em URLS e em id de salão e outras coisas, ta feio demais ficar colocando essas coisas em hardcode gente. De verdade, to cansada de arrumar

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
}); // Porque tem um axios instalado aqui? A gente tem a Fetch api do js e ja tem um hook pra isso.

api.interceptors.request.use(
  async (config) => {
    try {
      const usuarioString = await AsyncStorage.getItem("usuario");
      const token = await AsyncStorage.getItem("token");

      if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        config.headers.userID = usuario.userID;
        config.headers.userType = usuario.userType;
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error("Erro ao configurar cabeçalhos de autenticação:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  async (response) => {
    const tokenHeader = response.headers["authorization"]?.replace(
      "Bearer ",
      ""
    );
    const currentToken = await AsyncStorage.getItem("token");

    if (tokenHeader && tokenHeader !== currentToken) {
      console.log("Atualizando token no AsyncStorage");
      await AsyncStorage.setItem("token", tokenHeader);
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
    precoMin?: number | "",
    precoMax?: number | "",
    includeRelations: boolean = false
  ): Promise<ServicoPaginadoResponse> {
    try {
      console.log("Buscando serviços com:", {
        page,
        limit,
        salaoId,
        nome,
        precoMin,
        precoMax,
        includeRelations,
      });

      const response = await api.get("/servico/page", {
        params: {
          page,
          limit,
          nome,
          precoMin: precoMin === "" ? undefined : precoMin,
          precoMax: precoMax === "" ? undefined : precoMax,
          includeRelations,
          salaoId,
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
      const servico: Servico = {
        id: response.data.ID,
        salaoId: response.data.SalaoId,
        Nome: response.data.Nome,
        PrecoMin: response.data.PrecoMin,
        PrecoMax: response.data.PrecoMax,
        Descricao: response.data.Descricao,
      };
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
      console.error(`Erro ao buscar serviços para o salão ${salaoId}:`, error);
      throw error;
    }
  }

  static async createServico(servicoData: Servico): Promise<Servico> {
    try {
      const response = await api.post("/servico", servicoData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      throw error;
    }
  }

  static async updateServico(
    id: string,
    servicoData: Servico
  ): Promise<Servico> {
    try {
      const response = await api.put(`/servico/update/${id}`, servicoData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar serviço com ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteServico(id: string): Promise<void> {
    try {
      await api.delete(`/servico/delete/${id}`);
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
      console.error(
        `Erro ao buscar serviço com nome ${nome} para o salão ${salaoId}:`,
        error
      );
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
      console.error(
        `Erro ao buscar serviço com nome ${nome} para o salão ${salaoId}:`,
        error
      );
      throw error;
    }
  }
}

export default ServicoService;
