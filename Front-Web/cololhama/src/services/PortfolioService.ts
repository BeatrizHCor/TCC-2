import axios from "axios";
import { get } from "http";
const token = localStorage.getItem("usuario");
const api = axios.create({
  baseURL: import.meta.env.VITE_IMAGEM_URL || "http://localhost:4000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `${token}`,
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

class PortfolioService {
  static async uploadPortfolio(
    file: File,
    portfolioId: string,
    descricao: string
  ) {
    try {
      const formData = new FormData();
      formData.append("imagem", file, file.name);
      formData.append("PortfolioId", portfolioId);
      formData.append("Descricao", descricao);
      console.log(
        "Dados do FormData:",
        formData.get("PortfolioId"),
        formData.get("Descricao"),
        formData.get("imagem")
      );
      const response = await api.post(`/portfolio`, formData);

      return response.data;
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      throw new Error("Erro ao fazer upload.");
    }
  }

  static async getImagemById(id: string) {
    try {
      const response = await api.get(`/imagem/ID/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar imagem por ID:", error);
      throw new Error("Erro ao buscar imagem por ID.");
    }
  }

  static async getImagensByPortfolio(portfolioId: string) {
    try {
      const response = await api.get(`/portfolio/${portfolioId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro completo:", error.response || error.message);
      } else {
        console.error("Erro desconhecido:", error);
      }
      throw new Error("Erro ao buscar imagens por portfolio.");
    }
  }
}
export default PortfolioService;
