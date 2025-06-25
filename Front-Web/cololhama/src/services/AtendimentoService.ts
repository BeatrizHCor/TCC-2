import axios from "axios";
import { Atendimento } from "../models/atendimentoModal";
import { ServicoAtendimento } from "../models/servicoAtendimentoModel";
import { AtendimentoAuxiliar } from "../models/atendimentoAuxiliarModel";
import { StatusAgendamento } from "../models/StatusAgendamento.enum";

const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || "http://localhost:3002",
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
  static async getAtendimentosPageCabeleireiro(
    page: number,
    limit: number,
    clienteFilter: string,
    dataFilter: string,
    userId: string,
    salaoId: string
  ): Promise<AtendimentoPageResponse | boolean> {
    try {
      const response = await api.get(`cabeleireiro/atendimento/page`, {
        params: {
          page,
          limit,
          includeRelations: true,
          SalaoId: salaoId,
          cliente: clienteFilter,
          userId,
          data: dataFilter,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
      return false;
    } catch (error) {
      console.error("Erro ao buscar atendimentos:", error);
      return false;
    }
  }
  static async getAtendimentosPageCliente(
    page: number,
    limit: number,
    cabelereiroFilter: string,
    dataFilter: string,
    userId: string,
    salaoId: string
  ): Promise<AtendimentoPageResponse | boolean> {
    try {
      const response = await api.get(`cliente/atendimento/page`, {
        params: {
          page,
          limit,
          includeRelations: true,
          SalaoId: salaoId,
          cabeleireiro: cabelereiroFilter,
          userId,
          data: dataFilter,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
      return false;
    } catch (error) {
      console.error("Erro ao buscar atendimentos:", error);
      return false;
    }
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
      const response = await api.get(`funcionario/atendimento/page`, {
        params: {
          page,
          limit,
          includeRelations: true,
          SalaoId: salaoId,
          cliente: clienteFilter,
          cabeleireiro: cabelereiroFilter,
          data: dataFilter,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
      return false;
    } catch (error) {
      console.error("Erro ao buscar atendimentos:", error);
      return false;
    }
  }
  static getAtendimentobyAgendamentoId = async (agendamentoId: string) => {
    try {
      const response = await api.get(
        `/atendimentobyagendamento/${agendamentoId}`
      );
      if (response.status === 403) {
        return false;
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao criar atendimentos:", error);
      return false;
    }
  };

  static getAtendimentoById = async (atendimentoId: string) => {
  try {
    const response = await api.get(`/atendimento/ID/${atendimentoId}`);
    if (response.status === 403) {
      return false;
    }
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar atendimento:", error);
    return false;
  }
};
  static createAtendimento = async (
    Data: Date,
    PrecoTotal: number,
    Auxiliar: boolean,
    SalaoId: string,
    servicosAtendimento: ServicoAtendimento[] = [],
    auxiliares: AtendimentoAuxiliar[] = [],
    AgendamentoID: string,
    status: StatusAgendamento
  ) => {
    try {
      const response = await api.post(`/atendimento`, {
        Data,
        PrecoTotal,
        Auxiliar,
        SalaoId,
        servicosAtendimento,
        auxiliares,
        AgendamentoID,
        status,
      });
      if (response.status === 201) {
        return response.data;
      }
      return false;
    } catch (error) {
      console.error("Erro ao criar atendimentos:", error);
      return false;
    }
  };
  static updateAtendimento = async (
    AtendimentoId: string,
    Data: Date,
    PrecoTotal: number,
    Auxiliar: boolean,
    SalaoId: string,
    servicosAtendimento: ServicoAtendimento[] = [],
    auxiliares: AtendimentoAuxiliar[] = [],
    AgendamentoID: string,
    status: StatusAgendamento
  ) => {
    try {
      const response = await api.put(`/atendimento/${AtendimentoId}`, {
        Data,
        PrecoTotal,
        Auxiliar,
        SalaoId,
        servicosAtendimento,
        auxiliares,
        AgendamentoID,
        status,
      });
      if (response.status === 403) {
        return false;
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao criar atendimentos:", error);
      return false;
    }
  };
  static deleteAtendimento = async (atendimentoId: string) => {
    try {
      const response = await api.delete(`/atendimento/${atendimentoId}`);
      if (response.status === 403) {
        return false;
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao criar atendimentos:", error);
      return false;
    }
  };
}

export default AtendimentoService;
