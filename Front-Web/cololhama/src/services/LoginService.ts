import axios from "axios";
import { AuthControl } from "../models/authModel";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

export class LoginService {
  static async cadastrar(authData: AuthControl): Promise<AuthControl> {
    try {
      const requestData = {
        userID: authData.usuarioID,
        email: authData.email,
        password: authData.senha,
        salaoID: authData.salaoId,
        userType: authData.type,
      };
      console.log("Request Data:", requestData);
      const response = await api.post(`/register`, requestData);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      throw error;
    }
  }

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
        localStorage.setItem("usuario", JSON.stringify(response.data));

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
