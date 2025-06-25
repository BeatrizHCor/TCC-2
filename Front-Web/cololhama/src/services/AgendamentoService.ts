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
    page: number | null,
    limit: number | null,
    salaoId: string,
    ano: number,
    mes: number,
    dia: number,
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
    page: number | null,
    limit: number | null,
    salaoId: string,
    ano: number,
    mes: number,
    dia: number,
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
    page: number | null,
    limit: number | null,
    salaoId: string,
    ano: number,
    mes: number,
    dia: number,
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
  static async createFuncionarioAgendamento(
    Data: string,
    ClienteID: string,
    CabeleireiroID: string,
    SalaoId: string,
    servicosIds: string[] = []
  ): Promise<Agendamentos> {
    try {
      console.log("Parâmetros recebidos em createFuncionarioAgendamento:", {
        Data,
        ClienteID,
        CabeleireiroID,
        SalaoId,
        servicosIds,
      });
      const response = await api.post(`/funcionario/agendamento`, {
        Data,
        ClienteID,
        CabeleireiroID,
        SalaoId,
        servicosIds,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar agendamento (funcionário):", error);
      throw error;
    }
  }

  static async createCabeleireiroAgendamento(
    Data: string,
    ClienteID: string,
    CabeleireiroID: string,
    SalaoId: string,
    servicosIds: string[] = []
  ): Promise<Agendamentos> {
    try {
      const response = await api.post(`/cabeleireiro/agendamento`, {
        Data,
        ClienteID,
        CabeleireiroID,
        SalaoId,
        servicosIds,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar agendamento (cabeleireiro):", error);
      throw error;
    }
  }

  static async createClienteAgendamento(
    Data: string,
    ClienteID: string,
    CabeleireiroID: string,
    SalaoId: string,
    servicosIds: string[] = []
  ): Promise<Agendamentos> {
    try {
      const response = await api.post(`/cliente/agendamento`, {
        Data,
        ClienteID,
        CabeleireiroID,
        SalaoId,
        servicosIds,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar agendamento (cliente):", error);
      throw error;
    }
  }
  static async updateFuncionarioAgendamento(
    id: string,
    Data: string,
    Status: StatusAgendamento,
    ClienteID: string,
    CabeleireiroID: string,
    SalaoId: string,
    servicosIds: string[] = []
  ): Promise<Agendamentos> {
    try {
      const response = await api.put(`/funcionario/agendamento/${id}`, {
        Data,
        Status,
        ClienteID,
        CabeleireiroID,
        SalaoId,
        servicosIds,
      });
        console.log("Agendamento atualizado (funcionario):", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar agendamento (funcionário):", error);
      throw error;
    }
  }

  static async updateCabeleireiroAgendamento(
    id: string,
    Data: string,
    Status: StatusAgendamento,
    ClienteID: string,
    CabeleireiroID: string,
    SalaoId: string,
    servicosIds: string[] = []
  ): Promise<Agendamentos> {
    try {
      const response = await api.put(`/cabeleireiro/agendamento/${id}`, {
        Data,
        Status,
        ClienteID,
        CabeleireiroID,
        SalaoId,
        servicosIds,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar agendamento (cabeleireiro):", error);
      throw error;
    }
  }

  static async updateClienteAgendamento(
    id: string,
    Data: string,
    Status: StatusAgendamento,
    ClienteID: string,
    CabeleireiroID: string,
    SalaoId: string,
    servicosIds: string[] = []
  ): Promise<Agendamentos> {
    try {
              console.log("Parâmetros recebidos em updateClienteAgendamento:", {
        Data,
        ClienteID,
        CabeleireiroID,
        SalaoId,
        servicosIds,
      });
      const response = await api.put(`/cliente/agendamento/${id}`, {
        Data,
        Status,
        ClienteID,
        CabeleireiroID,
        SalaoId,
        servicosIds,
      });
      console.log("Agendamento atualizado (cliente):", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar agendamento (cliente):", error);
      throw error;
    }
  }

  static async getFuncionarioAgendamentoById(
    id: string,
    includeRelations: boolean
  ): Promise<Agendamentos> {
    try {
      const response = await api.get(`/funcionario/agendamento/${id}`, {
        params: { includeRelations },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar agendamento por ID:", error);
      throw error;
    }
  }

  static async getCabeleireiroAgendamentoById(
    id: string,
    includeRelations: boolean
  ): Promise<Agendamentos> {
    try {
      const response = await api.get(`/cabeleireiro/agendamento/${id}`, {
        params: { includeRelations },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar agendamento por ID:", error);
      throw error;
    }
  }
  static async getClienteAgendamentoById(
    id: string,
    includeRelations: boolean
  ): Promise<Agendamentos> {
    try {
      const response = await api.get(`/cliente/agendamento/${id}`, {
        params: { includeRelations },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar agendamento por ID:", error);
      throw error;
    }
  }
  static async deleteFuncionarioAgendamento(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/funcionario/agendamento/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error("Erro ao deletar agendamento (funcionário):", error);
      return false;
    }
  }

  static async deleteCabeleireiroAgendamento(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/cabeleireiro/agendamento/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error("Erro ao deletar agendamento (cabeleireiro):", error);
      return false;
    }
  }

  static async deleteClienteAgendamento(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/cliente/agendamento/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error("Erro ao deletar agendamento (cliente):", error);
      return false;
    }
  }
  static async getHorariosOcupadosFuturos(
    salaoId: string,
    cabeleireiroId: string,
    data: string
  ): Promise<[string, number][] | false> {
    try {
      const response = await api.get(
        `/agendamento/horarios/${salaoId}/${cabeleireiroId}`,
        { params: { data } }
      );
      if (response.status === 200) {
        console.log("buscar horários ocupados futuros: ", response.data);
        return response.data;
      }
      console.error(
        "Erro ao buscar horários ocupados futuros:",
        response.status
      );
      return false;
    } catch (error) {
      console.error("Erro ao buscar horários ocupados futuros:", error);
      return false;
    }
  }
}
export default AgendamentoService;
