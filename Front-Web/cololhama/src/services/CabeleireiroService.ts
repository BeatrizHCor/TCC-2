import axios from "axios";
import { Cabeleireiro } from "../models/cabelereiroModel";
//import { c } from "vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";
import { Password } from "@mui/icons-material";
import { LoginService } from "./LoginService";

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
    const tokenHeader = response.headers["authorization"]?.replace("Bearer ", "");
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
    userType: string = "Cabeleireiro", 
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
        Mei
      });
      if (response.data.token) {
        const { token, userID, userType } = response.data;
        LoginService.SetSession(token, userID, userType);
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
    name?: string 
  ): Promise<CabeleireiroPageResponse> {
    try {
      const response = await api.get(`/cabeleireiro/page`, {
        params: {
          page,
          limit,
          includeRelations,
          salaoId,
          name
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
    Password: string,
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
        Password
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar cabeleireiro:", error);
      throw error;
    }
  }

};

export default CabeleireiroService;
