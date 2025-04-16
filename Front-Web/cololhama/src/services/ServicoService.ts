import axios from "axios";
import { Servico } from "../models/servicoModel";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
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
    precoMin?: number,
    precoMax?: number
  ): Promise<ServicoPaginadoResponse> {
    try {
      const response = await api.get(`/servico/page`, {
        params: {
          page,
          limit,
          precoMin,
          precoMax,
          includeRelations: false,
          salaoId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      throw error;
    }
  }

  static async getServicoById(id: string): Promise<Servico> {
    try {
      const response = await api.get(`/servico/ID/${id}`);
      return response.data;
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
    servicoData: Omit<Servico, "ID">
  ): Promise<Servico> {
    try {
      const response = await api.post(`/servico`, servicoData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      throw error;
    }
  }

  static async updateServico(
    id: string,
    servicoData: Partial<Servico>
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
}

export default ServicoService;
