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
    const dadosEnvio = {
      CPF: CPF,
      Nome: nome,
      Email: email,
      Telefone: telefone,
      SalaoId: salaoId,
      Password: password,
      userType: userType,
    };
    try {
      const response = await api.post(`/cadastrar/cliente`, dadosEnvio);

      if (response.data && response.data.token) {
        localStorage.setItem("usuario", JSON.stringify(response.data));
        console.log("Token salvo no localStorage");
      }

      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error("Erro detalhado ao cadastrar cliente:", error);
      if (axios.isAxiosError(error)) {
        console.error("Status do erro:", error.response?.status);
        console.error("Dados do erro:", error.response?.data);
        console.error("Headers do erro:", error.response?.headers);
      }

      throw error;
    }
  },

  async getClientePage(
    page: number = 1,
    limit: number = 10,
    salaoId: string,
    termoBusca: string,
    campoBusca: string,
    dataFilter: string,
    includeRelations: boolean = false
  ): Promise<ClientePageResponse | boolean> {
    try {
      const response = await api.get(`/cliente/page`, {
        params: {
          page,
          limit,
          salaoId,
          termoBusca,
          campoBusca,
          dataFilter,
          includeRelations,
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
      const path = `/cliente/checkcpf/${cpf}/${salaoId}`;
      console.log(`Verificando cliente por CPF no caminho: ${path}`);
      const response = await api.get(path);

      if (response.status === 204) {
        console.log("Cliente não encontrado (status 204), retornando false.");
        return false;
      }

      console.log("Resposta da verificação CPF:", response.data);
      return !!response.data;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 404 || error.response?.status === 204)
      ) {
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
  async getClientesBySalao(
    salaoId: string,
    include: boolean = false
  ): Promise<Cliente[]> {
    try {
      const response = await api.get(
        `/cliente/salaoId/${salaoId}?include=${include}`
      );
      return response.data as Cliente[];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        console.error("SalaoId é obrigatório.");
        throw error;
      }
      console.error("Erro ao buscar clientes do salão:", error);
      throw error;
    }
  },
};

export default ClienteService;
