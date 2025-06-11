import React, {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { userTypes } from "../models/tipo-usuario.enum";

interface ComponentProps {
  children: ReactNode;
}

interface AuthContextInterface {
  token: string;
  userId: string;
  userType: userTypes | undefined;
  doLogin: (email: string, password: string) => Promise<void>;
  doAuthenticate: () => Promise<void>;
  doLogout: () => void;
  checkLocalStorage: () => Promise<boolean>;
}

export const AuthContext = createContext({
  token: "",
  userId: "",
  userType: userTypes.Cliente,
  doLogin: async () => {},
  doAuthenticate: async () => {},
  doLogout: () => {},
  checkLocalStorage: async () => true,
} as AuthContextInterface);

export const AuthContextProvider = ({ children }: ComponentProps) => {
  const [token, setToken] = useState("");
  const [userId, setuserId] = useState("");
  const [userType, setUserType] = useState<userTypes | undefined>();

  const url = import.meta.env.VITE_GATEWAY_URL || "http://localhost:5000";
  const salaoId = import.meta.env.VITE_SALAO_ID || "1";

  const doLogin = async (email: string, password: string) => {
    try {
      console.log("Fazendo login com:", { email, password, salaoId, url });

      const response = await fetch(`${url}/login`, {
        method: "POST",
        body: JSON.stringify({ Email: email, password, SalaoID: salaoId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Login falhou. Status:", response.status);
        return;
      }

      const infos = await response.json();
      console.log("Login bem-sucedido. Infos recebidas:", infos);

      localStorage.setItem("usuario", JSON.stringify(infos));
      setToken(infos.token);
      setuserId(infos.userId);
      setUserType(infos.userType);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const doAuthenticate = async () => {
  };

  const doLogout = () => {
    localStorage.removeItem("usuario");
    setUserType(undefined);
    setuserId("");
    setToken("");
  };

  const checkLocalStorage = async () => {
    const userStr = localStorage.getItem("usuario");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log("Usuário encontrado no localStorage:", user);
        setToken(user.token);
        setuserId(user.userID); 
        setUserType(user.userType);
        return true;
      } catch (error) {
        console.error("Erro ao interpretar localStorage:", error);
      }
    }
    return false;
  };

  useEffect(() => {
    checkLocalStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        userType,
        doLogin,
        doAuthenticate,
        doLogout,
        checkLocalStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
