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
        includeRelations: boolean = false,
        salaoId: string
    ): Promise<FuncionarioPageResponse> {
        try {
            const response = await api.get<FuncionarioPageResponse>(
                `/funcionario/pages`, {
                    params: {
                      page,
                      limit,
                      includeRelations,
                      salaoId,
                    },
                  });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
            throw error;
        }
    }

}

export default FuncionarioService;