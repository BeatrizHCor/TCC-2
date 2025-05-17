import axios from "axios";
import { Funcionario } from "../models/funcionarioModel";
import { get } from "http";

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
  ): Promise<FuncionarioPageResponse> {
    try {
      console.log("Buscando funcionários com o nome:", nome);
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
      console.log("Funcionários recebidos:", response.data);
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
      const response = await api.post(`/funcionario`, {
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
      if (response.data.token) {
        const { token, userID, userType } = response.data;
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      throw error;
    }
  },

  async deleteFuncionario(id: string): Promise<void> {
    try {
      const response = await api.delete(`/funcionario/delete/${id}`);
      if (response.status === 200) {
        console.log("Funcionario deletedo: ", response.data.Nome);
      }
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
      throw error;
    }
  },

  async getFuncionarioById(
    id: string,
    includeRelations: boolean = false
  ): Promise<Funcionario> {
    try {
      const response = await api.get<Funcionario>(`/funcionario/ID/${id}`, {
        params: { include: includeRelations },
      });
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
};

export default FuncionarioService;
