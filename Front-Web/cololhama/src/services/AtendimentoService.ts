import axios from "axios";
import { Atendimento } from "../models/atendimentoModal";

const token = localStorage.getItem("usuario");
const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: btoa(token || ""),
  },
});
interface AtendimentoPageResponse {
    data: Atendimento[];
    total: number;
    page: number;
    limit: number;
    }
class AtendimentoService {
  static getAtendimentosByCabeleireiro(page: number, limit: number, clienteFilter: string, dataFilter: string, userId: string, salaoId: string): any {
    throw new Error("Method not implemented.");
  }
  static getAtendimentosByCliente(page: number, limit: number, cabelereiroFilter: string, dataFilter: string, userId: string, salaoId: string): any {
    throw new Error("Method not implemented.");
  }
  static async getAtendimentosPage(
    page: number,
    limit: number,
    clienteFilter: string,
    cabelereiroFilter: string,
    dataFilter: string,
    salaoId: string
  ): Promise<AtendimentoPageResponse | boolean> {
    try {
      const response = await api.get(`/atendimentos`, {
        params: {
          page,
          limit,
          cliente: clienteFilter,
          cabelereiro: cabelereiroFilter,
          data: dataFilter,
          salao: salaoId,
        },
      });
    if (response.status === 403) {
        return false;
    }
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar atendimentos:", error);
      return false;
    }
  }
}

export default AtendimentoService;