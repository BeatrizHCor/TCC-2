import "dotenv/config";
import { Cliente } from "../models/clienteModel";
import { response } from "express";

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
  switch (responseCliente.status) {
    case 201:
      return (await responseCliente.json()) as Cliente;
    case 400:
      console.error(
        "Requisição inválida ao criar cliente (campos obrigatórios ausentes ou inválidos)",
      );
      return false;
    case 409:
      console.error("Já existe um cliente com este email para este salão");
      return false;
    case 500:
      console.error("Erro interno ao criar cliente");
      return false;
    default:
      console.error(`Erro ao criar cliente: status ${responseCliente.status}`);
      return false;
  }
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
  if (responseClientes.ok) {
    return (await responseClientes.json()) as Cliente[];
  } else {
    console.error(
      "Erro ao buscar clientes (getClientePage):",
      responseClientes.status,
    );
    return false;
  }
};

export const getClienteById = async (id: string, includeRelations = false) => {
  let responseCliente = await fetch(
    CustomerURL + `/cliente/ID/${id}?include=${includeRelations}`,
    {
      method: "GET",
    },
  );
  switch (responseCliente.status) {
    case 200:
      return (await responseCliente.json()) as Cliente;
    case 400:
      console.error(
        "Requisição inválida ao buscar cliente por ID, parâmetros ausentes ou inválidos",
      );
      return false;
    case 204:
      console.error("Cliente não encontrado (204 No Content)");
      return false;
    case 500:
      console.error("Erro interno ao buscar cliente por ID");
      return false;
    default:
      console.error(
        `Erro ao buscar cliente por ID: status ${responseCliente.status}`,
      );
      return false;
  }
};
export const getClienteByCPF = async (cpf: string, salaoId: string) => {
  console.log(CustomerURL + `/cliente/cpf/${cpf}/${salaoId}`);
  let responseCliente = await fetch(
    CustomerURL + `/cliente/cpf/${cpf}/${salaoId}`,
    {
      method: "GET",
    },
  );
  switch (responseCliente.status) {
    case 200:
      return (await responseCliente.json()) as Cliente;
    case 400:
      console.error(
        "Requisição inválida ao buscar cliente por CPF, parâmetros ausentes ou inválidos",
      );
      return false;
    case 204:
      console.error("Cliente não encontrado (204 No Content)");
      return false;
    case 500:
      console.error("Erro interno ao buscar cliente por CPF");
      return false;
    default:
      console.error(
        `Erro ao buscar cliente por CPF: status ${responseCliente.status}`,
      );
      return false;
  }
};

export const deleteCliente = async (id: string) => {
  let responseCliente = await fetch(CustomerURL + `/cliente/delete/${id}`, {
    method: "DELETE",
  });
  switch (responseCliente.status) {
    case 204:
      console.error("Cliente Deletedo");
      return true;
    case 404:
      console.error("Erro interno ao deletar cliente, cliente não localizado");
      return false;
    case 500:
      console.error("Erro interno ao deletar cliente");
      return false;
    default:
      throw new Error(
        `Erro ao deletar cliente: status ${responseCliente.status}`,
      );
  }
};

export const updateCliente = async (id: string, data: Cliente) => {
  console.log(CustomerURL + `/cliente/${id}`);
  console.log(data);
  let responseCliente = await fetch(CustomerURL + `/cliente/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  switch (responseCliente.status) {
    case 200:
      return (await responseCliente.json()) as Cliente;
    case 400:
      console.error("Erro interno ao atualizar cliente, parâmetros ausentes ou inválidos");
      return false;
    case 404:
      console.error("Erro interno ao atualizar cliente, cliente não localizado");
      return false;
    case 500:
      console.error("Erro interno ao atualizar cliente");
      return false;
    default:
      throw new Error(
        `Erro ao atualizar cliente: status ${responseCliente.status}`,
      );
  }
};
