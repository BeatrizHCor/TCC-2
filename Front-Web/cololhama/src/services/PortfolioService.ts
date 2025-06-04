import axios from "axios";
import { get } from "http";

const api = axios.create({
  baseURL: import.meta.env.VITE_IMAGEM_URL || "http://localhost:4000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});
const apiUpload = axios.create({
   baseURL: import.meta.env.VITE_IMAGEM_URL || "http://localhost:4000",
   timeout: 100000,
   headers: {
     'Content-Type': 'multipart/form-data',
   },
 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("usuario");
  config.headers = config.headers || {};
  config.headers.Authorization = btoa(token || "");
  return config;
});

apiUpload.interceptors.request.use((config) => {
  const token = localStorage.getItem("usuario");
  config.headers = config.headers || {};
  config.headers.Authorization = btoa(token || "");
  return config;
});

class PortfolioService {
  static async uploadImagemPortfolio(
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
      const response = await apiUpload.post(`/imagem/portfolio`, formData);

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
      const response = await api.get(`/portfolio/ID/${portfolioId}`);
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
  static async getPortfolioByCabeleireiroId(cabeleireiroId: string) {
    try {
      const response = await api.get(`/portfolio/${cabeleireiroId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro completo:", error.response || error.message);
      } else {
        console.error("Erro desconhecido:", error);
      }
      throw new Error("Erro ao buscar portfólio por cabeleireiro.");
    }
  }
}
export default PortfolioService;
