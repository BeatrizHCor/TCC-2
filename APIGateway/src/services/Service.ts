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
  userType: userTypes,
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
    console.log("Register response for user", userID);
  } else {
    console.log("Register failed", responseRegister.status);
  }
  return responseRegister.ok;
};
export const cadastrarCliente = async (
  CPF: string,
  Nome: string,
  Email: string,
  Telefone: string,
  SalaoId: string,
  Password: string,
  userType: userTypes,
) => {
  let responseRegister = await fetch(loginURL + "/cadastrar/cliente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      CPF,
      Nome,
      Email,
      Telefone,
      SalaoId,
      Password,
      userType,
    }),
  });
  if (responseRegister.ok) {
    console.log("Register response for client", responseRegister.status);
    return await responseRegister.json();
  } else {
    console.log("Register failed", responseRegister.status);
    return false;
  }
};

export const cadastrarFuncionario = async (
  CPF: string,
  Nome: string,
  Email: string,
  Telefone: string,
  SalaoId: string,
  Auxiliar: boolean,
  Salario: number,
  Password: string,
  userType: userTypes,
) => {
  let responseRegister = await fetch(loginURL + "/cadastrar/funcionario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      CPF,
      Nome,
      Email,
      Telefone,
      SalaoId,
      Auxiliar,
      Salario,
      Password,
      userType,
    }),
  });
  if (responseRegister.ok) {
    console.log(
      "Register response for funcionario",
      responseRegister.status,
    );
    return await responseRegister.json();
  } else {
    console.log("Register failed", responseRegister.status);
    return false;
  }
};

export const cadastrarCabeleireiro = async (
  CPF: string,
  Nome: string,
  Email: string,
  Telefone: string,
  SalaoId: string,
  Mei: string,
  Password: string,
  userType: userTypes,
) => {
  let responseRegister = await fetch(loginURL + "/cadastrar/cabeleireiro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      CPF,
      Nome,
      Email,
      Telefone,
      SalaoId,
      Mei,
      Password,
      userType,
    }),
  });
  if (responseRegister.ok) {
    console.log(
      "Register response for cabeleireiro",
      responseRegister.status,
    );
    return await responseRegister.json();
  } else {
    console.log("Register failed", responseRegister.status);
    return false;
  }
};

export const postLogin = async (
  Email: string,
  password: string,
  SalaoID: string,
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
  userType: userTypes,
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
export const updateLoginPassword = async (
  userID: string,
  newPassword: string,
  SalaoId: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(loginURL + "/login/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userID,
      newPassword,
      SalaoId,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    return {
      success: true,
      message: data.message || "Senha atualizada com sucesso.",
    };
  } else {
    const data = await response.json().catch(() => ({}));
    return {
      success: false,
      message: data.message || "Erro ao atualizar senha.",
    };
  }
};
