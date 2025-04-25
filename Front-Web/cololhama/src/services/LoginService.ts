import axios from "axios";
import { AuthControl } from "../models/authModel";

const api = axios.create({
  baseURL: import.meta.env.APIGATEWAY_URL || "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export class LoginService {

  static async login(
    email: string,
    senha: string,
    salaoId: string
  ): Promise<AuthControl> {
    try {
      const response = await api.post(`/login`, {
        email: email,
        password: senha,
        salaoID: salaoId,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("usuario", JSON.stringify({ email, salaoId }));

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    delete axios.defaults.headers.common["Authorization"];
  }

  static getUsuarioLogado(): AuthControl | null {
    const usuarioString = localStorage.getItem("usuario");
    if (usuarioString) {
      return JSON.parse(usuarioString);
    }
    return null;
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
