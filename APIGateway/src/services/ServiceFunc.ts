import "dotenv/config";
import { Funcionario } from "../models/funcionarioModel";
import { Servico } from "../models/servicoModel";
import e, { response } from "express";
import { handleApiResponse } from "../utils/HandlerDeRespostaDoBackend";

const FuncionarioURL = process.env.FUNC_URL || "http://localhost:3002";
export const postFuncionario = async (
  CPF: string,
  Nome: string,
  Email: string,
  Telefone: string,
  SalaoId: string,
  Auxiliar: boolean,
  Salario: number
) => {
  let responseFuncionario = await fetch(FuncionarioURL + "/funcionario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      CPF: CPF,
      Nome: Nome,
      Email: Email,
      Telefone: Telefone,
      SalaoId: SalaoId,
      Auxiliar: Auxiliar,
      Salario: Salario,
    }),
  });
  return handleApiResponse<Funcionario>(
    responseFuncionario,
    "criar Funcionario"
  );
};

export const getFuncionarioPage = async (
  page: string,
  limit: string,
  nome: string,
  includeRelations: boolean = false,
  salaoId: string
) => {
  let responseFuncionarios = await fetch(
    FuncionarioURL +
      `/funcionario/page?page=${page}&limit=${limit}&nome=${nome}&includeRelations=${includeRelations}&salaoId=${salaoId}`,
    {
      method: "GET",
    }
  );
  return handleApiResponse<Funcionario[]>(
    responseFuncionarios,
    "buscar Funcionario paginado"
  );
};

export const deleteFuncionario = async (id: string) => {
  let responseFuncionario = await fetch(
    FuncionarioURL + `/funcionario/delete/${id}`,
    {
      method: "DELETE",
    }
  );
  if (responseFuncionario.ok) {
    return (await responseFuncionario.json()) as Funcionario;
  } else {
    throw new Error("Error in deleting Funcionario");
  }
};

export const updateFuncionario = async (
  id: string,
  Nome: string,
  CPF: string,
  Email: string,
  Telefone: string,
  SalaoId: string,
  Auxiliar: boolean,
  Salario: number
) => {
  let responseFuncionario = await fetch(
    FuncionarioURL + `/funcionario/update/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nome,
        CPF,
        Email,
        Telefone,
        SalaoId,
        Auxiliar,
        Salario,
      }),
    }
  );
  return handleApiResponse<Funcionario>(
    responseFuncionario,
    "update Funcionario"
  );
};
export const getFuncionarioById = async (id: string) => {
  let responseFuncionario = await fetch(
    FuncionarioURL + `/funcionario/ID/${id}`,
    {
      method: "GET",
    }
  );
  return handleApiResponse<Funcionario>(
    responseFuncionario,
    "buscar Funcionario por ID"
  );
};

export const getAuxiliarBySalao = async (id: string) => {
  let responseFuncionario = await fetch(
    FuncionarioURL + `/auxiliar/salao/${id}`,
    {
      method: "GET",
    }
  );
  return handleApiResponse<Funcionario[]>(
    responseFuncionario,
    "buscar Auxiliar por Salao"
  );
};

// -------------SERVIÇOS----------------
export const getServicoPage = async (
  page: string,
  limit: string,
  salaoId: string,
  nome: string,
  precoMin: string,
  precoMax: string,
  includeRelations: boolean = false
) => {
  let responseServicos = await fetch(
    FuncionarioURL +
      `/servico/page?page=${page}&limit=${limit}&salaoId=${salaoId}&nome=${nome}&precoMin=${precoMin}&precoMax=${precoMax}&includeRelations=${includeRelations}`,
    {
      method: "GET",
    }
  );
  return handleApiResponse<Servico>(
    responseServicos,
    "buscar servicos por page"
  );
};

export const postServico = async (
  Nome: string,
  SalaoId: string,
  PrecoMin: number,
  PrecoMax: number,
  Descricao: string
) => {
  let responseServico = await fetch(FuncionarioURL + "/servico", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Nome: Nome,
      SalaoId: SalaoId,
      PrecoMin: PrecoMin,
      PrecoMax: PrecoMax,
      Descricao: Descricao,
    }),
  });
  return handleApiResponse<Servico>(responseServico, "update servico");
};

export const deleteServico = async (id: string) => {
  let responseServico = await fetch(FuncionarioURL + `/servico/delete/${id}`, {
    method: "DELETE",
  });
  if (responseServico.status === 204) {
    return true;
  }
  return handleApiResponse<Servico>(
    responseServico,
    "buscar servico por nome e salao"
  );
};

export const updateServico = async (
  id: string,
  Nome: string,
  SalaoId: string,
  PrecoMin: number,
  PrecoMax: number,
  Descricao: string
) => {
  let responseServico = await fetch(FuncionarioURL + `/servico/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Nome: Nome,
      SalaoId: SalaoId,
      PrecoMin: PrecoMin,
      PrecoMax: PrecoMax,
      Descricao: Descricao,
    }),
  });
  return handleApiResponse<Servico>(responseServico, "update servico");
};

export const getServicoById = async (id: string) => {
  let responseServico = await fetch(FuncionarioURL + `/servico/ID/${id}`, {
    method: "GET",
  });
  return handleApiResponse<Servico>(responseServico, "buscar servico por Id");
};

export const getServicosBySalao = async (salaoId: string) => {
  let responseServicos = await fetch(
    FuncionarioURL + `/servico/salao/${salaoId}`,
    {
      method: "GET",
    }
  );
  return handleApiResponse<Servico>(
    responseServicos,
    "buscar servico por salao"
  );
};

export const findServicoByNomeAndSalaoId = async (
  nome: string,
  salaoId: string
) => {
  let responseServico = await fetch(
    FuncionarioURL + `/servico/find/${nome}/${salaoId}`,
    {
      method: "GET",
    }
  );
  return handleApiResponse<Servico>(
    responseServico,
    "buscar servico por nome e salao"
  );
};
