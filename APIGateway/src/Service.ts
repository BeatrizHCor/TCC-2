import "dotenv/config";
import { Cliente } from "./models/clienteModel";
import { userTypes } from "./models/tipo-usuario.enum";
import { accessSync } from "fs";
import { Cabeleireiro } from "./models/cabelereiroModel";
import e from "express";

const CustomerURL = process.env.CUSTOMER_URL || "http://localhost:4001";
const loginURL = process.env.AUTH_URL || "http://localhost:4000";
const CabeleireiroURL = process.env.CABELEREIRO_URL || "http://localhost:4002";
const FuncionarioURL = process.env.FUNCIONARIO_URL || "http://localhost:4003";

export const postCliente = async (
  CPF: string,
  Nome: string,
  Email: string,
  Telefone: string,
  SalaoId: string
) => {
  let responseCliente = await fetch(CustomerURL + "/cliente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ CPF, Nome, Email, Telefone, SalaoId }),
  });
  if (responseCliente.ok) {
    return (await responseCliente.json()) as Cliente;
  } else {
    throw new Error("Error in posting customer");
  }
};

export const postCabeleireiro = async (cabeleireiro: Cabeleireiro) => {
  let responseCabeleireiro = await fetch(CabeleireiroURL + "/cabeleireiro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cabeleireiro),
  });
  if (responseCabeleireiro.ok) {
    return (await responseCabeleireiro.json()) as Cabeleireiro;
  } else {
    throw new Error("Error in posting Cabeleireiro");
  }
};

export const getCabeleireiroPage = async (
  page: number,
  limit: number,
  includeRelations: boolean = false,
  salaoId: number
) => {
  let responseCabeleireiros = await fetch(
    CabeleireiroURL +
      `/cabeleireiro/page?page=${page}&limit=${limit}&includeRelations=${includeRelations}&salaoId=${salaoId}`,
    {
      method: "GET",
    }
  );
  if (responseCabeleireiros.ok) {
    return (await responseCabeleireiros.json()) as Cabeleireiro[];
  } else {
    throw new Error("Error in posting Cabeleireiro");
  }
};

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

export const getClientePage = async (
  page: string,
  limit: string,
  includeRelations: boolean = false,
  salaoId: string
) => {
  let responseClientes = await fetch(
    CustomerURL +
      `/cliente/page`,
       {
      method: "GET",
      body: JSON.stringify({
        page,
        limit,
        includeRelations,
        salaoId,
      }),
    }
  );
  if (responseClientes.ok) {
    return (await responseClientes.json()) as Cliente[];
  } else {
    throw new Error("Error in getting cliente page");
  }
};

export const getCliente = async (id: string, includeRelations: boolean) => {
  let responseCliente = await fetch(
    CustomerURL + `/cliente/ID/${id}?include=${includeRelations}`,
    {
      method: "GET",
    }
  );
  if (responseCliente.ok) {
    return (await responseCliente.json()) as Cliente;
  } else {
    throw new Error("Error in getting cliente");
  }
};

export const getClienteByCPF = async (cpf: string, salaoId: string) => {
  let responseCliente = await fetch(
    CustomerURL + `/cliente/cpf/${cpf}/${salaoId}`,
    {
      method: "GET",
    }
  );
  if (responseCliente.ok) {
    return (await responseCliente.json()) as Cliente;
  } else {
    throw new Error("Error in getting cliente by CPF");
  }
};  

export const getClienteByEmail = async (email: string, salaoId: string) => {
  let responseCliente = await fetch(
    CustomerURL + `/cliente/email/${email}/${salaoId}`,
    {
      method: "GET",
    }
  );
  if (responseCliente.ok) {
    return (await responseCliente.json()) as Cliente;
  } else {
    throw new Error("Error in getting cliente by email");
  }
}

export const deleteCliente = async (email:string, salaoId:string) => { 
  let responseCliente = await fetch(
    CustomerURL + `/cliente/delete/${email}/${salaoId}`,
    {
      method: "DELETE",
    }
  );
  if (responseCliente.ok) {
    return (await responseCliente.json()) as Cliente;
  } else {
    throw new Error("Error in deleting cliente");
  }
}