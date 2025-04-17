import axios from "axios";
import { Servico } from "../models/servicoModel";

const api = axios.create({
  baseURL:  'http://localhost:3002',
  headers: {
    "Content-Type": "application/json",
  },
});
interface ServicoData {
  Nome: string;
  SalaoId: string;
  PrecoMin: number;
  PrecoMax: number;
  Descricao: string;  
}

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
      const servico: Servico = {
        id: response.data.ID,
        salaoId: response.data.SalaoId,
        nome: response.data.Nome,        
        precoMin: response.data.PrecoMin,
        precoMax: response.data.PrecoMax,
        descricao: response.data.Descricao,        
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
      console.error(`Erro ao buscar serviços do salão ${salaoId}:`, error);
      throw error;
    }
  }

  static async createServico(
    servicoData: Omit<Servico, "ID">
  ): Promise<Servico> {
    try {
      const servicoCreate: ServicoData = {
        Nome: servicoData.nome || "",
        SalaoId: servicoData.salaoId || "",
        PrecoMin: servicoData.precoMin || 0,
        PrecoMax: servicoData.precoMax || 0,
        Descricao: servicoData.descricao || "",
      }
      const response = await api.post(`/servico`, servicoCreate);
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
      const servicoEditado: ServicoData = {
        Nome: servicoData.nome || "",
        SalaoId: servicoData.salaoId || "",
        PrecoMin: servicoData.precoMin || 0,
        PrecoMax: servicoData.precoMax || 0,
        Descricao: servicoData.descricao || "",
      }
      const response = await api.put(`/servico/update/${id}`, servicoEditado);
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
