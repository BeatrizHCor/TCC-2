import axios from "axios";
import { Agendamentos } from "../models/agendamentoModel";
import { StatusAgendamento } from "../models/StatusAgendamento.enum";

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
  static deletarAgendamento(id: string) {
      throw new Error("Method not implemented.");
  }
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
  static async createAgendamento(
    Data: Date,
    ClienteID: string,
    SalaoId: string,
    CabeleireiroID: string
  ): Promise<Agendamentos> {
    try {
      const response = await api.post(`/agendamento`, {
        Data,
        ClienteID,
        SalaoId,
        CabeleireiroID
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      throw error;
    }
  }

  static async updateAgendamento(
    id: string,
    Data: Date,
    Status: StatusAgendamento,
    ClienteID: string,
    CabeleireiroID: string
  ): Promise<Agendamentos> {
    try {
      const response = await api.put(`/agendamento/${id}`,
      {
        Data: Data,
        Status: Status,
        ClienteID,
        CabeleireiroID
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      throw error;
    }
  }
}

export default AgendamentoService;
