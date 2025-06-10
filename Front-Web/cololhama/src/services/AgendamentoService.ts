import axios from "axios";
import { Agendamentos } from "../models/agendamentoModel";
import { StatusAgendamento } from "../models/StatusAgendamento.enum";
import { ServicoAgendamento } from "../models/servicoAgendamentoModel";

const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || "http://localhost:5000",
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

interface AgendamentoPaginadoResponse {
  total: number;
  page: number;
  limit: number;
  data: Agendamentos[];
}

class AgendamentoService {
  static async FuncionariogetAgendamentosPaginados(
    page: number = 1,
    limit: number = 10,
    salaoId: string,
    ano?: number,
    mes?: number,
    dia?: number,
    includeRelations: boolean = false
  ): Promise<AgendamentoPaginadoResponse> {
    try {
      const response = await api.get(`/funcionario/agendamento/page`, {
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
  static async CabeleireirogetAgendamentosPaginados(
  page: number = 1,
  limit: number = 10,
  salaoId: string,
  ano?: number,
  mes?: number,
  dia?: number,
  includeRelations: boolean = false
): Promise<AgendamentoPaginadoResponse> {
  try {
    const response = await api.get(`/cabeleireiro/agendamento/page`, {
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
    console.log("Agendamentos recebidos (cabeleireiro):", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos (cabeleireiro):", error);
    throw error;
  }
}

static async ClientegetAgendamentosPaginados(
  page: number = 1,
  limit: number = 10,
  salaoId: string,
  ano?: number,
  mes?: number,
  dia?: number,
  includeRelations: boolean = false
): Promise<AgendamentoPaginadoResponse> {
  try {
    const response = await api.get(`/cliente/agendamento/page`, {
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
    console.log("Agendamentos recebidos (cliente):", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos (cliente):", error);
    throw error;
  }
}
static async createAgendamento(
    Data: string,
    ClienteID: string,
    CabeleireiroID: string,
    SalaoId: string,
    ServicoId: string[] = []
  ): Promise<Agendamentos> {
    try {
      const response = await api.post(`/agendamento`, {
      Data,
      ClienteID,
      CabeleireiroID,
      SalaoId,
      ServicoId
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      throw error;
    }
  }

  static async updateAgendamento(
    id: string,
    Data: string,
    Status: StatusAgendamento,
    ClienteID: string,
    CabeleireiroID: string,
    SalaoId: string,
    ServicoId: string[] = []
  ): Promise<Agendamentos> {
    try {
      const response = await api.put(`/agendamento/${id}`,
      {
        Data: Data,
        Status: Status,
        ClienteID,
        CabeleireiroID,
        SalaoId,
        ServicoId
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      throw error;
    }
  }
  static async getFuncionarioAgendamentoById(id: string): Promise<Agendamentos> {
    try {
      const response = await api.get(`/funcionario/agendamento/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar agendamento por ID:", error);
      throw error;
    }
  }
  static async getCabeleireiroAgendamentoById(id: string): Promise<Agendamentos> {
    try {
      const response = await api.get(`/cabeleireiro/agendamento/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar agendamento por ID:", error);
      throw error;
    }
  }  
  static async getClienteAgendamentoById(id: string): Promise<Agendamentos> {
    try {
      const response = await api.get(`/cliente/agendamento/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar agendamento por ID:", error);
      throw error;
    }
  }
  static deletarAgendamento(id: string): Promise<Agendamentos> {
      throw new Error("Method not implemented.");
  }
    static deleteAgendamento(agendamentoId: string) {
      throw new Error("Method not implemented.");
  }

}

export default AgendamentoService;
