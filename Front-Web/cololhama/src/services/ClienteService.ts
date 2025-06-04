import axios from "axios";
import { Cliente } from "../models/clienteModel";

const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || "http://localhost:5000",
  timeout: 10000,
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
        localStorage.setItem("usuario", JSON.stringify(response.data));
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
  ): Promise<ClientePageResponse | boolean> {
    try {
      const response = await api.get(`/cliente/page`, {
        params: {
          page,
          limit,
          includeRelations,
          salaoId,
        },
      });
      if (response.status === 403) {
        console.log("Chamada não autorizada");
        return false;
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar página de clientes:", error);
      throw error;
    }
  },

  async getClienteByCpfAndSalao(
    cpf: string,
    salaoId: string
  ): Promise<boolean> {
    try {
      const path = `/cliente/cpf/${cpf}/${salaoId}`;
      console.log(`Verificando cliente por CPF no caminho: ${path}`);
      const response = await api.get(path);
      if (response.status === 204) {
        console.log("Cliente não encontrado, retornando false.");
        return false;
      }
      console.log("Resposta do servidor:", response.data);
      return !!response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("Cliente não encontrado, retornando false.");
        return false;
      }
      console.error("Erro ao verificar cliente por CPF:", error);
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
