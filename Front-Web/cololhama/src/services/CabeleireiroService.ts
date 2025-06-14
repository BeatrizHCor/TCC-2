import axios from "axios";
import { Cabeleireiro } from "../models/cabelereiroModel";
import { Password } from "@mui/icons-material";
const token = localStorage.getItem("usuario");

const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || "http://localhost:5000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json"
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("usuario");
  config.headers = config.headers || {};
  config.headers.Authorization = btoa(token || "");
  return config;
});

interface CabeleireiroPageResponse {
  data: Cabeleireiro[];
  total: number;
  page: number;
  limit: number;
}
export const CabeleireiroService = {
  async cadastrarCabeleireiro(
    CPF: string,
    Nome: string,
    Email: string,
    Telefone: string,
    Mei: string,
    SalaoId: string,
    Password: string,
    userType: string = "Cabeleireiro"
  ): Promise<Cabeleireiro> {
    try {
      const response = await api.post("/cabeleireiro", {
        CPF,
        Nome,
        Email,
        Telefone,
        SalaoId,
        Password,
        userType,
        Mei,
      });
      if (response.data.token) {
        const { token, userID, userType } = response.data;
      }
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
    salaoId: string,
    nome?: string
  ): Promise<CabeleireiroPageResponse> {
    try {
      const response = await api.get(`/cabeleireiro/page`, {
        params: {
          page,
          limit,
          includeRelations,
          salaoId,
          nome
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar página de cabeleireiros:", error);
      throw error;
    }
  },

  async getCabeleireiroById(
    id: string,
    includeRelations: boolean = false
  ): Promise<Cabeleireiro> {
    try {
      const response = await api.get(`/cabeleireiro/ID/${id}`, {
        params: { include: includeRelations },
      });
      const cabeleireiro: Cabeleireiro = response.data;
      return cabeleireiro;
    } catch (error) {
      console.error("Erro ao buscar cabeleireiro por ID:", error);
      throw error;
    }
  },

  async deleteCabeleireiro(id: string): Promise<Cabeleireiro> {
    try {
      const response = await api.delete(`/cabeleireiro/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar cabeleireiro:", error);
      throw error;
    }
  },
  async UpdateCabeleireiro(
    ID: string,
    CPF: string,
    Nome: string,
    Email: string,
    Telefone: string,
    Mei: string,
    SalaoId: string,
    Password: string
  ): Promise<Cabeleireiro> {
    try {
      const response = await api.put(`/cabeleireiro`, {
        ID,
        CPF,
        Nome,
        Email,
        Telefone,
        Mei,
        SalaoId,
        Password,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar cabeleireiro:", error);
      throw error;
    }
  },

  async getCabeleireiroBySalao(salaoId: string, includeRelations: boolean): Promise<Cabeleireiro[]> {
    try {
      const response = await api.get(`/cabeleireiro/salao/${salaoId}`, {
        params: { includeRelations }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar cabeleireiros por salão:", error);
      throw error;
    }
  }

};

export default CabeleireiroService;
