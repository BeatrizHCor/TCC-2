import "dotenv/config";
import { Servico , Funcionario} from "@prisma/client";
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
        body: JSON.stringify(
            {   CPF: CPF,
                Nome: Nome,
                Email: Email,
                Telefone: Telefone,
                SalaoId: SalaoId,
                Auxiliar: Auxiliar,
                Salario: Salario,
            }),
    
        });
    if (responseFuncionario.ok) {
        return (await responseFuncionario.json()) as Funcionario;
    } else {
        throw new Error("Error in posting Funcionario");
    }
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
    "buscar Funcionario paginado",
  );
}

export const deleteFuncionario = async (id: string) => {
    let responseFuncionario = await fetch(FuncionarioURL + `/funcionario/delete/${id}`, {
        method: "DELETE",
    });
    if (responseFuncionario.ok) {
        return (await responseFuncionario.json()) as Funcionario;
    }
    else {
        throw new Error("Error in deleting Funcionario");
    }
}

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
    let responseFuncionario = await fetch(FuncionarioURL + `/funcionario/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {       Nome,
                    CPF,
                    Email,
                    Telefone,
                    SalaoId,
                    Auxiliar,
                    Salario           
            }),
    });
  return handleApiResponse<Funcionario[]>(
    responseFuncionario,
    "buscar Funcionario paginado",
  );
};
export const getFuncionarioById = async (id: string) => {
    let responseFuncionario = await fetch(FuncionarioURL + `/funcionario/ID/${id}`, {
        method: "GET",
    });
    if (responseFuncionario.ok) {
        return (await responseFuncionario.json()) as Funcionario;
    } else {
        throw new Error("Error in getting Funcionario by ID");
    }
}

export const getFuncionarioByCpf = async (cpf:string, salaoId: string) => {
    let responseFuncionario = await fetch(FuncionarioURL + `/funcionario/cpf/${cpf}/${salaoId}`, {
        method: "GET",
    });
  return handleApiResponse<Funcionario>(
    responseFuncionario,
    "buscar Funcionario por cpf",
  );
}