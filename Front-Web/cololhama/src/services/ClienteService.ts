import axios from "axios";
import { Cliente } from "../models/clienteModel";

const api = axios.create({
  baseURL: import.meta.env.APIGATEWAY_URL || "http://localhost:5000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("usuario");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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
      password,
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
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("usuario", JSON.stringify({ email, salaoId }));

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }
      return !!response.data;
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      throw error;
    }
  },

  async verificarClienteEmailExistente(
    email: string,
    salaoId: string
  ): Promise<boolean> {
    try {
      const response = await api.get(`/cliente/email/${email}/${salaoId}`);
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
};

export default ClienteService;
