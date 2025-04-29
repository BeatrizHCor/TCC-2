import axios from "axios";
import { AuthControl } from "../models/authModel";
import { stringify } from "querystring";

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
        localStorage.setItem("usuario", JSON.parse(response.data.userID, response.data.userType));
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
static getUserID(): string | null {
    const usuario = this.getUserData();
    return usuario?.userID || null;
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static getUserType = (): string | null => {
    const usuario = this.getUserData();
    return usuario?.userType || null;
  };

  private static getUserData = (): { userID: string; userType: string } | null => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  };

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
