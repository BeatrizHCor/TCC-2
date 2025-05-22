import axios from "axios";
import { Agendamentos } from "../models/agendamentoModel";

const token = localStorage.getItem("usuario");
const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: token,
  },
});

// set os dados do usuario para autenticação no header de cada requisição
api.interceptors.request.use(
  (config) => {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      const { userID, userType } = JSON.parse(usuario);
      config.headers.userID = userID;
      config.headers.userType = userType;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// verifique se a resposta contém um novo token e atualiza
api.interceptors.response.use(
  (response) => {
    const tokenHeader = response.headers["authorization"]?.replace(
      "Bearer ",
      ""
    );
    const currentToken = localStorage.getItem("token");
    if (tokenHeader !== currentToken && currentToken) {
      console.log("Atualizando token na memória local");
      localStorage.setItem("token", tokenHeader);
      axios.defaults.headers.common["Authorization"] = `Bearer ${tokenHeader}`;
    }
    return response;
  },
  (error) => {
    console.error("Erro na resposta da API:", error);
    return Promise.reject(error);
  }
);

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
