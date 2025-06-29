import axios from "axios";
import { get } from "http";

const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
const apiUpload = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
const addAuthInterceptor = (axiosInstance: any) => {
  axiosInstance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem("usuario");
    config.headers = config.headers || {};
    config.headers.Authorization = btoa(token || "");
    return config;
  });
};

addAuthInterceptor(api);
addAuthInterceptor(apiUpload);

class PortfolioService {
  static async uploadImagemPortfolio(
    file: File,
    PortfolioId: string,
    descricao: string,
  ) {
    try {
      const formData = new FormData();
      formData.append("imagem", file, file.name);
      formData.append("PortfolioId", PortfolioId);
      formData.append("Descricao", descricao);
      const response = await apiUpload.post(`/imagem/portfolio/${PortfolioId}`, formData);

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
  static async atualizarPortfolio(PortfolioId: string, descricaoPortfolio : string) {
    try {
      const response = await api.put(`/portfolio/${PortfolioId}`, {
        descricaoPortfolio ,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro completo:", error.response || error.message);
      } else {
        console.error("Erro desconhecido:", error);
      }
      throw new Error("Erro ao atualizar portfólio por Id.");
    }
  }
  static async deleteImagemPortfolio(portfolioId: string, imagemId: string) {
    try {
      const response = await api.delete(`/imagem/${portfolioId}/${imagemId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro completo:", error.response || error.message);
      } else {
        console.error("Erro desconhecido:", error);
      }
      throw new Error("Erro ao excluir foto do portfolio.");
    }
  }
}
export default PortfolioService;
