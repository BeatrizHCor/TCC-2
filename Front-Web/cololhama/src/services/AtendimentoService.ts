import axios from "axios";
import { Atendimento } from "../models/atendimentoModal";

const token = localStorage.getItem("usuario");
const api = axios.create({
  baseURL: import.meta.env.FUNC_URL || "http://localhost:3002",
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

interface AtendimentoPageResponse {
    data: Atendimento[];
    total: number;
    page: number;
    limit: number;
    }
  class AtendimentoService {
  static getAtendimentosPageCabeleireiro(page: number, limit: number, clienteFilter: string, dataFilter: string, userId: string, salaoId: string): any {
    throw new Error("Method not implemented.");
  }
  static getAtendimentosPageCliente(page: number, limit: number, cabelereiroFilter: string, dataFilter: string, userId: string, salaoId: string): any {
    throw new Error("Method not implemented.");
  }
  static async getAtendimentosPageFuncionario(
    page: number,
    limit: number,
    clienteFilter: string,
    cabelereiroFilter: string,
    dataFilter: string,
    salaoId: string
  ): Promise<AtendimentoPageResponse | boolean> {
    try {
      const response = await api.get(`/atendimento/page`, {
        params: {
          page,
          limit,
          includeRelations: true,
          SalaoId: salaoId,
          cliente: clienteFilter,
          cabelereiro: cabelereiroFilter,
          data: dataFilter,
        },
      });
    if (response.status === 403) {
        return false;
    }console.log("Atendimentos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar atendimentos:", error);
      return false;
    }
  }
}

export default AtendimentoService;