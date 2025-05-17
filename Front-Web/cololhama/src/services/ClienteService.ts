import axios from "axios";
import { Cliente } from "../models/clienteModel";

const api = axios.create({
  baseURL: import.meta.env.APIGATEWAY_URL || "http://localhost:5000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
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

interface ClientePageResponse {
  data: Cliente[];
  total: number;
  page: number;
  limit: number;
}
export const ClienteService = {
  async cadastrarCliente({
    CPF,
    nome,
    email,
    telefone,
    salaoId,
    password,
    userType,
  }: {
    CPF: string;
    nome: string;
    email: string;
    telefone: string;
    salaoId: string;
    password: string;
    userType: string;
  }): Promise<boolean> {
    console.log("Dados recebidos para cadastro:", {
      CPF,
      nome,
      email,
      telefone,
      salaoId,
      userType,
    });
    try {
      const response = await api.post(`/cliente`, {
        CPF: CPF,
        Nome: nome,
        Email: email,
        Telefone: telefone,
        SalaoId: salaoId,
        Password: password,
        userType: userType,
      });
      if (response.data.token) {
        const { token, userID, userType } = response.data;
      }
      return !!response.data;
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      throw error;
    }
  },

  async getClienteByID(ID: string): Promise<boolean> {
    try {
      const response = await api.get(`/cliente/${ID}`);
      return !!response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("Cliente não encontrado, retornando false.");
        return false;
      }
      console.error("Erro ao verificar cliente:", error);
      throw error;
    }
  },

  async getClientePage(
    page: number = 1,
    limit: number = 10,
    includeRelations: boolean = false,
    salaoId: string
  ): Promise<ClientePageResponse> {
    try {
      const response = await api.get(`/cliente/page`, {
        params: {
          page,
          limit,
          includeRelations,
          salaoId,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar página de clientes:", error);
      throw error;
    }
  },

  async getClienteById(clienteId: string): Promise<Cliente> {
    try {
      const response = await api.get(`/cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar cliente por ID:", error);
      throw error;
    }
  },

  async atualizarCliente(
    id: string,
    CPF: string,
    Nome: string,
    Email: string,
    Telefone: string,
    SalaoId: string
  ): Promise<Cliente> {
    try {
      const response = await api.put(`/cliente/${id}`, {
        CPF,
        Nome,
        Email,
        Telefone,
        SalaoId,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  },
};

export default ClienteService;
