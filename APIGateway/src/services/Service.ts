import "dotenv/config";
import { Cliente } from "../models/clienteModel";
import { userTypes } from "../models/tipo-usuario.enum";
import { accessSync } from "fs";
import { Cabeleireiro } from "../models/cabelereiroModel";
import e from "express";
import { Servico } from "../models/servicoModel";

const CustomerURL = process.env.CUSTOMER_URL || "http://localhost:4001";
const loginURL = process.env.AUTH_URL || "http://localhost:4000";



export const registerLogin = async (
  userID: string,
  email: string,
  password: string,
  salaoId: string,
  userType: userTypes
) => {
  let responseRegister = await fetch(loginURL + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userID,
      email,
      password,
      salaoId,
      userType,
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
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID, token, userType }),
  });
  if (response.ok) {
    let token = await response.json();
    return token;
  } else {
    throw new Error("Error in Authentication");
  }
};
//Todas as outras funções vão usar a função de authenticate no Service para verificar se o usuário é quem diz ser, pra depois permitir.




