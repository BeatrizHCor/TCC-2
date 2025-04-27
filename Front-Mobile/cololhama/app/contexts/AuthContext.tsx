import React, {
  Children,
  Component,
  createContext,
  ReactNode,
  useState,
} from "react";

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
  userType: userTypeEnum;
  doLogin: (email: string, password: string) => Promise<void>;
  doAuthenticate: () => Promise<void>;
}

export const AuthContext = createContext({
  token: "",
  userId: "",
  userType: userTypeEnum.Cliente,
  doLogin: async () => {},
  doAuthenticate: async () => {},
} as AuthContextInterface);

export const AuthContextProvider = ({ children }: ComponentProps) => {
  const [token, setToken] = useState("");
  const [userId, setuserId] = useState("");
  const [userType, setUserType] = useState<userTypeEnum>(userTypeEnum.Cliente);

  const doLogin = async (email: string, password: string) => {};

  const doAuthenticate = async () => {};

  return (
    <AuthContext.Provider
      value={{ token, userId, userType, doLogin, doAuthenticate }}
    >
      {children}
    </AuthContext.Provider>
  );
};
