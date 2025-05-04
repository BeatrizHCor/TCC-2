import "dotenv/config";
import { Cliente } from "../models/clienteModel";


const CustomerURL = process.env.CUSTOMER_URL || "http://localhost:4001";


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

export const getClientePage = async (
  page: string,
  limit: string,
  includeRelations: boolean = false,
  salaoId: string
) => {
  let responseClientes = await fetch(
    CustomerURL +
      `/cliente/page?page=${page}&limit=${limit}&includeRelations=${includeRelations}&salaoId=${salaoId}`,
    {
      method: "GET",
    }
  );
  if (responseClientes.ok) {
    return (await responseClientes.json()) as Cliente[];
  } else {
    throw new Error("Error in getting cliente page");
  }
};


export const getClienteById = async (id: string, includeRelations: boolean) => {
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