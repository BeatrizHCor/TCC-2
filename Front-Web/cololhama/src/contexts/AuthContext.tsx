import React, {
  Children,
  Component,
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { userTypes } from "../models/tipo-usuario.enum";

interface ComponentProps {
  children: ReactNode;
}
enum userTypeEnum {
  Cliente,
  Funcionario,
  Cabeleireiro,
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
  const url = import.meta.env.VITE_GATEWAY_URL;
  const salaoId = import.meta.env.VITE_SALAO_ID || "1";

  const doLogin = async (email: string, password: string) => {
    let response = await fetch(url + "/login", {
      method: "POST",
      body: JSON.stringify({ Email: email, password, SalaoID: salaoId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      let infos = await response.json();
      localStorage.setItem("usuario", JSON.stringify(infos));
      setToken(infos.token);
      setuserId(infos.userId);
      setUserType(infos.userType);
    }
  };

  const doAuthenticate = async () => {};

  const doLogout = () => {
    localStorage.removeItem("usuario");
    setUserType(undefined);
    setuserId("");
    setToken("");
  };

  const checkLocalStorage = async () => {
    let userStr = localStorage.getItem("usuario");
    if (userStr) {
      console.log(userStr);
      let user = await JSON.parse(userStr);
      setToken(user.token);
      setuserId(user.userID);
      setUserType(user.userType);
    }
    return userStr !== null;
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
