import "dotenv/config";
import { Funcionario } from "../models/funcionarioModel";
import { Servico } from "../models/servicoModel";
import e, { response } from "express";

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
  nome: string | null = null,
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
  if (responseFuncionarios.ok) {
    return (await responseFuncionarios.json()) as Funcionario[];
  } else {
    throw new Error("Error in getting funcionario page");
  }
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
    if (responseFuncionario.ok) {
        return (await responseFuncionario.json()) as Funcionario;
    } else {
        throw new Error("Error in updating Funcionario");
    }
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


// -------------SERVIÇOS----------------
export const getServicoPage = async (
    page: string,
    limit: string,
    nome: string | null = null,
    precoMin: number | null = null,
    precoMax: number | null = null,
    includeRelations: boolean = false,
    salaoId: string
  ) => {
    let responseServicos = await fetch(
      FuncionarioURL +
      `/servico/page?page=${page}&limit=${limit}&nome=${nome}&precoMin=${precoMin}&precoMax=${precoMax}&includeRelations=${includeRelations}&salaoId=${salaoId}`,
      {
      method: "GET",
      }
    );
    if (responseServicos.ok) {
      return (await responseServicos.json()) as Servico[];
    } else {
      throw new Error("Error in getting servico page");
    }
  }

  export const postServico = async (
    servicoData: Servico
  ) => {
    let responseServico = await fetch(FuncionarioURL + "/servico", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(servicoData),
      });
    if (responseServico.ok) {
        return (await responseServico.json()) as Servico;
    } else {
        throw new Error("Error in posting Servico");
    }
}

export const deleteServico = async (id: string) => {
    let responseServico = await fetch(FuncionarioURL + `/servico/delete/${id}`, {
        method: "DELETE",
    });
    if (responseServico.ok) {
        return (await responseServico.json()) as Servico;
    } else {
        throw new Error("Error in deleting Servico");
    }
}

export const updateServico = async (id: string, servicoData: Servico) => {
    let responseServico = await fetch(FuncionarioURL + `/servico/update/${id}`, { 
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(servicoData),
    });
    if (responseServico.ok) {  
        return (await responseServico.json()) as Servico;
    } else {
        throw new Error("Error in updating Servico");
    }
}

export const getServicoById = async (id: string) => {
    let responseServico = await fetch(FuncionarioURL + `/servico/ID/${id}`, {
        method: "GET",
    });
    if (responseServico.ok) {
        return (await responseServico.json()) as Servico;
    } else {
        throw new Error("Error in getting Servico by ID");
    }
}

export const getServicosBySalao = async (salaoId: string) => {
    let responseServicos = await fetch(FuncionarioURL + `/servico/salao/${salaoId}`, {
        method: "GET",
    });
    if (responseServicos.ok) {
        return (await responseServicos.json()) as Servico[];
    } else {
        throw new Error("Error in getting Servicos by Salão ID");
    }
}


export const findServicoByNomeAndSalaoId = async (nome: string, salaoId: string) => {
    let responseServico = await fetch(FuncionarioURL + `/servico/find/${nome}/${salaoId}`, {
        method: "GET",
    });
    if (responseServico.ok) {
        return (await responseServico.json()) as Servico[];
    } else {
        throw new Error("Error in finding Servico by Nome and Salão ID");
    }
}