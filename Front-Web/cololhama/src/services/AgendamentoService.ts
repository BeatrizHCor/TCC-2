import axios from "axios";
import { Agendamentos } from "../models/agendamentoModel";

const token = localStorage.getItem("usuario");
const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: btoa(token || ""),
  },
});


interface AgendamentoPaginadoResponse {
  total: number;
  page: number;
  limit: number;
  data: Agendamentos[];
}

class AgendamentoService {
  static async getAgendamentosPaginados(
    page: number = 1,
    limit: number = 10,
    salaoId: string,
    ano?: number,
    mes?: number,
    dia?: number,
    includeRelations: boolean = false
  ): Promise<AgendamentoPaginadoResponse> {
    try {
      const response = await api.get(`/agendamento/page`, {
        params: {
          page,
          limit,
          salaoId,
          ano,
          mes,
          dia,
          includeRelations,
        },
      });
      console.log("Agendamentos recebidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      throw error;
    }
  }
}

export default AgendamentoService;
