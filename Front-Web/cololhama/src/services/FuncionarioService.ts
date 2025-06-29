import axios from "axios";
import { Funcionario } from "../models/funcionarioModel";
import { get } from "http";

const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || "http://localhost:5000",
  timeout: 100000,
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
interface FuncionarioPageResponse {
  data: Funcionario[];
  total: number;
  page: number;
  limit: number;
}

export const FuncionarioService = {
  async getFuncionarioPage(
    page: number = 1,
    limit: number = 10,
    nome: string | null = null,
    includeRelations: boolean = false,
    salaoId: string
  ): Promise<FuncionarioPageResponse | boolean> {
    try {
      const response = await api.get<FuncionarioPageResponse>(
        `/funcionario/page`,
        {
          params: {
            page,
            limit,
            nome,
            includeRelations,
            salaoId,
          },
        }
      );
      if (response.status === 403) {
        return false;
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      throw error;
    }
  },

  async cadastrarFuncionario(
    CPF: string,
    Nome: string,
    Email: string,
    Telefone: string,
    SalaoId: string,
    Auxiliar: boolean,
    Salario: number,
    Password: string,
    userType: string = "Funcionario"
  ): Promise<Funcionario> {
    try {
      const response = await api.post(`/cadastrar/funcionario`, {
        CPF,
        Nome,
        Email,
        Telefone,
        SalaoId,
        Auxiliar,
        Salario,
        Password,
        userType,
      });
      if (response.status === 403) {
        console.error("Acesso negado ao cadastrar funcionário.");
        throw new Error("Acesso negado");
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      throw error;
    }
  },

  async deleteFuncionario(id: string): Promise<{status: string, message: string}|false> {
    try {
      const response = await api.delete(`/funcionario/delete/${id}`);
      if (response.status === 200 && response.data && response.data.status) {
        return { status: response.data.status, message: response.data.message };
      } else if (response.status === 404) {
        return { status: "nao_encontrado", message: "Funcionário não encontrado ou não deletado." };
      } else {
        return false;
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        return { status: "erro", message: error.response.data.message };
      }
      console.error("Erro ao deletar funcionário:", error);
      return { status: "erro", message: "Erro ao deletar funcionário." };
    }
  },

  async getFuncionarioById(
    id: string,
    includeRelations: boolean = false
  ): Promise<Funcionario | boolean> {
    try {
      const response = await api.get<Funcionario>(`/funcionario/ID/${id}`, {
        params: { include: includeRelations },
      });
      if (response.status === 403) {
        return false;
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar funcionário por ID:", error);
      throw error;
    }
  },

  async updateFuncionario(
    id: string,
    Nome: string,
    CPF: string,
    Email: string,
    Telefone: string,
    SalaoId: string,
    Auxiliar: boolean,
    Salario: number = 0,
    password: string
  ): Promise<Funcionario> {
    try {
      const response = await api.put<Funcionario>(`/funcionario/update/${id}`, {
        Nome,
        CPF,
        Email,
        Telefone,
        SalaoId,
        Auxiliar,
        Salario,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      throw error;
    }
  },

  async getAuxiliarBySalao(salaoId: string): Promise<Funcionario[] | boolean> {
    try {
      const response = await api.get<Funcionario[]>(`/auxiliar/${salaoId}`);
      if (response.status === 403) {
        return false;
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar funcionário por ID:", error);
      throw error;
    }
  },
};

export default FuncionarioService;
