import "dotenv/config";
import { userTypes } from "../models/tipo-usuario.enum";
import { accessSync } from "fs";
import e from "express";

const loginURL = process.env.AUTH_URL || "http://localhost:3000";

export const registerLogin = async (
  userID: string,
  Email: string,
  Password: string,
  SalaoId: string,
  userType: userTypes
) => {
  let responseRegister = await fetch(loginURL + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userID,
      Email,
      Password,
      SalaoId,
      userType,
    }),
  });
  if (responseRegister.ok) {
    console.log("Register response for user", userID, ":", responseRegister.ok);
  } else {
    console.log("Register failed", responseRegister.status);
  }
  return responseRegister.ok;
};

export const postLogin = async (
  Email: string,
  password: string,
  SalaoID: string
) => {
  let responseLogin = await fetch(loginURL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Email,
      password,
      SalaoID,
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
    return true;
  } else {
    return false;
  }
};
//Todas as outras funções vão usar a função de authenticate no Service para verificar se o usuário é quem diz ser, pra depois permitir.
