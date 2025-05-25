import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cabeleireiro } from "../models/cabelereiroModel";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  async (config) => {
    try {
      const usuarioString = await AsyncStorage.getItem("usuario");
      config.headers.Authorization = `${usuarioString}`;

      return config;
    } catch (error) {
      console.error("Erro ao configurar cabeçalhos de autenticação:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

interface CabeleireiroPaginadoResponse {
  data: Cabeleireiro[];
  total: number;
  page: number;
  limit: number;
}

class CabeleireiroService {
  static async getCabeleireiroPaginados(
    page: number = 1,
    limit: number = 10,
    salaoId: string,
    nome?: string,
    includeRelations: boolean = false
  ): Promise<CabeleireiroPaginadoResponse> {
    try {
      console.log("Buscando cabeleireiro com:", {
        page,
        limit,
        salaoId,
        nome,
        includeRelations,
      });

      const response = await api.get("/cabeleireiro/page", {
        params: {
          page,
          limit,
          nome,
          includeRelations,
          salaoId,
        },
      });

      console.log("Cabeleireiros recebidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar cabeleireirosleilos:", error);
      throw error;
    }
  }

  static async getCabeleireiroById(id: string): Promise<Cabeleireiro> {
    try {
      const response = await api.get(`/cabeleireiro/ID/${id}`);
      const cabeleireiro: Cabeleireiro = {
        ID: response.data.ID,
        SalaoId: response.data.SalaoId,
        Nome: response.data.Nome,
        CPF: response.data.CPF,
        Email: response.data.Email,
        Telefone: response.data.Telefone,
        Mei: response.data.Mei,
        DataCadastro: response.data.DataCadastro,
      };
      return cabeleireiro;
    } catch (error) {
      console.error(`Erro ao buscar serviço com ID ${id}:`, error);
      throw error;
    }
  }

  static async getCabeleireiroBySalao(
    salaoId: string
  ): Promise<Cabeleireiro[]> {
    try {
      const response = await api.get(`/cabeleireiro/salao/${salaoId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviços para o salão ${salaoId}:`, error);
      throw error;
    }
  }

  static async createCabeleireiro(
    cabeleireiroData: Cabeleireiro
  ): Promise<Cabeleireiro> {
    try {
      const response = await api.post("/cabeleireiro", cabeleireiroData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      throw error;
    }
  }

  static async updateCabeleireiro(
    id: string,
    cabeleireiroData: Cabeleireiro
  ): Promise<Cabeleireiro> {
    try {
      const response = await api.put(
        `/cabeleireiro/update/${id}`,
        cabeleireiroData
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar serviço com ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteCabeleireiro(id: string): Promise<void> {
    try {
      await api.delete(`/cabeleireiro/delete/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir serviço com ID ${id}:`, error);
      throw error;
    }
  }

  static async getCabeleireiroByNomeAndSalao(
    nome: string,
    salaoId: string
  ): Promise<Cabeleireiro> {
    try {
      const response = await api.get(`/cabeleireiro/nome/${nome}/${salaoId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar serviço com nome ${nome} para o salão ${salaoId}:`,
        error
      );
      throw error;
    }
  }

  static async findCabeleireiroByNomeAndSalaoId(
    nome: string,
    salaoId: string
  ): Promise<Cabeleireiro[]> {
    try {
      const response = await api.get(`/cabeleireiro/find/${nome}/${salaoId}`);
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

export default CabeleireiroService;
