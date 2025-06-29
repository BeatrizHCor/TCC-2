import "dotenv/config";
import { Cliente } from "../models/clienteModel";
import { response } from "express";
import { handleApiResponse } from "../utils/HandlerDeRespostaDoBackend";

const CustomerURL = process.env.CUSTOMER_URL || "http://localhost:4001";

export const postCliente = async (
  CPF: string,
  Nome: string,
  Email: string,
  Telefone: string,
  SalaoId: string,
) => {
  let responseCliente = await fetch(CustomerURL + "/cliente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ CPF, Nome, Email, Telefone, SalaoId }),
  });
  return handleApiResponse<Cliente>(
    responseCliente,
    "criar Cliente",
  );
};

export const getClientePage = async (
  page: string,
  limit: string,
  salaoId: string,
  includeRelations: boolean,
  termoBusca: string,
  campoBusca: string,
  dataFilter: string,
) => {
  let responseClientes = await fetch(
    CustomerURL +
      `/cliente/page?page=${page}&limit=${limit}&salaoId=${salaoId}&includeRelations=${includeRelations}&termoBusca=${termoBusca}&campoBusca=${campoBusca}&dataFilter=${dataFilter}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Cliente[]>(
    responseClientes,
    "buscar cliente Paginado",
  );
};

export const getClienteById = async (id: string, includeRelations = false) => {
  let responseCliente = await fetch(
    CustomerURL + `/cliente/ID/${id}?include=${includeRelations}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Cliente>(
    responseCliente,
    "buscar cliente por ID",
  );
};
export const getClienteByCPF = async (cpf: string, salaoId: string) => {
  let responseCliente = await fetch(
    CustomerURL + `/cliente/cpf/${cpf}/${salaoId}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Cliente>(
    responseCliente,
    "buscar cliente por CPF",
  );
};

export const deleteCliente = async (id: string) => {
  let responseCliente = await fetch(CustomerURL + `/cliente/delete/${id}`, {
    method: "DELETE",
  });
  if (responseCliente.status === 204) {
    return true;
  }
  return handleApiResponse<Cliente>(
    responseCliente,
    "buscar cliente por CPF",
  );
};

export const updateCliente = async (id: string, data: Cliente) => {
  let responseCliente = await fetch(CustomerURL + `/cliente/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleApiResponse<Cliente>(
    responseCliente,
    "atualizar cliente",
  );
};

export const getClientesBySalao = async (
  salaoId: string,
  include: boolean = false,
) => {
  let responseCliente = await fetch(
    CustomerURL + `/cliente/salaoId/${salaoId}?include=${include}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Cliente[]>(
    responseCliente,
    "buscar clientes do salao",
  );
};