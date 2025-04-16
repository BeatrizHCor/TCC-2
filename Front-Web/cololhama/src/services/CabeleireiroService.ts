import axios from "axios";
import { Cabeleireiro } from "../models/cabelereiroModel";

const api = axios.create({
  baseURL: "http://localhost:3000",
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

interface CabeleireiroPageResponse {
  data: Cabeleireiro[];
  total: number;
  page: number;
  limit: number;
}
export const CabeleireiroService = {
  async cadastrarCabeleireiro(
    cabeleireiro: Cabeleireiro
  ): Promise<Cabeleireiro> {
    try {
      const novoCabeleireiro = {
        CPF: cabeleireiro.cpf,
        Nome: cabeleireiro.nome,
        Email: cabeleireiro.email,
        Telefone: String(cabeleireiro.telefone),
        SalaoId: cabeleireiro.salaoId,
      };
      const response = await api.post("/cabeleireiro", novoCabeleireiro);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar cabeleireiro:", error);
      throw error;
    }
  },

  async verificarCabeleireiroEmailExistente(
    email: string,
    salaoId: string
  ): Promise<boolean> {
    try {
      const response = await api.get(`/cabeleireiro/email/${email}/${salaoId}`);
      return !!response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("Cabeleireiro não encontrado, retornando false.");
        return false;
      }
      console.error("Erro ao verificar cabeleireiro:", error);
      throw error;
    }
  },

  async verificarCabeleireiroCpfExistente(
    cpf: string,
    salaoId: string
  ): Promise<boolean> {
    try {
      const path = `/cabeleireiro/cpf/${cpf}/${salaoId}`;
      console.log(`Verificando cabeleireiro por CPF no caminho: ${path}`);
      const response = await api.get(path);
      console.log("Resposta do servidor:", response.data);
      return !!response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("Cabeleireiro não encontrado, retornando false.");
        return false;
      }
      console.error("Erro ao verificar cabeleireiro por CPF:", error);
      throw error;
    }
  },

  async getCabeleireiroPage(
    page: number = 1,
    limit: number = 10,
    includeRelations: boolean = false,
    salaoId: string
  ): Promise<CabeleireiroPageResponse> {
    try {
      const response = await api.get(`/cabeleireiro/page`, {
        params: {
          page,
          limit,
          includeRelations,
          salaoId,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar página de cabeleireiros:", error);
      throw error;
    }
  },
};

export default CabeleireiroService;
