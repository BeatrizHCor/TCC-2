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
    const tokenHeader = response.headers["authorization"]?.replace("Bearer ", "");
    const currentToken = localStorage.getItem("token");
    if (tokenHeader !== currentToken && currentToken){
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
        try {console.log("Buscando funcionários com o nome:", nome);
            const response = await api.get<FuncionarioPageResponse>(
                `/funcionario/page`, {
                    params: {
                      page,
                      limit,
                      nome,
                      includeRelations,
                      salaoId,
                    },
                  });console.log("Funcionários recebidos:", response.data);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
            throw error;
        }
    }

}

export default FuncionarioService;