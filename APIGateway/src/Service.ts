import "dotenv/config";
import { Cliente } from "./models/clienteModel";
import { userTypes } from "./models/tipo-usuario.enum";
import { accessSync } from "fs";

const CustomerURL = process.env.CustomerURL || "http://localhost:3001";
const loginURL = process.env.AuthURL || "http://localhost:3000";

export const postCliente = async (
  CPF: string,
  Nome: string,
  Email: string,
  Telefone: string,
  SalaoId: string
) => {
  let responseCliente = await fetch(CustomerURL + "/cliente", {
    method: "POST",
    body: JSON.stringify({ CPF, Nome, Email, Telefone, SalaoId }),
  });
  if (responseCliente.ok) {
    return (await responseCliente.json()) as Cliente;
  } else {
    throw new Error("Error in posting customer");
  }
};

export const registerLogin = async (
  userType: userTypes,
  userID: string,
  email: string,
  password: string,
  salaoId: string
) => {
  let responseRegister = await fetch(loginURL + "/register", {
    method: "POST",
    body: JSON.stringify({
      userType,
      userID,
      email,
      password,
      salaoId,
    }),
  });
  if (responseRegister.ok) {
    return await responseRegister.json();
  } else {
    await fetch(CustomerURL + `/cliente/delete/${email}/${salaoId}`);
    throw new Error("Error in registering login");
  }
};

export const postLogin = async (
  email: string,
  password: string,
  salaoID: string
) => {
  let responseLogin = await fetch(loginURL + "/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      salaoID,
    }),
  });
  if (responseLogin.ok) {
    return await responseLogin.json();
  } else {
    throw new Error("Error in making login");
  }
};

export const authenticate = async (
  userID: string,
  token: string,
  userType: userTypes
) => {
  let response = await fetch(loginURL + "/authenticate", {
    method: "POST",
    body: JSON.stringify({ userID, token, userType }),
  });
  if (response.ok) {
    let token = await response.json();
    return token;
  } else {
    throw new Error("Error in Authentication");
  }
};
