import { Cabeleireiro } from "../models/cabelereiroModel";
import "dotenv/config";
import { Portfolio } from "../models/portifolioModel";
import { handleApiResponse } from "../utils/HandlerDeRespostaDoBackend";

const CabeleireiroURL = process.env.CABELEREIRO_URL || "http://localhost:4002";
const Auth_URL = process.env.AUTH_URL || "http://localhost:4001";
export const postCabeleireiro = async (cabeleireiro: Cabeleireiro) => {
  let responseCabeleireiro = await fetch(CabeleireiroURL + "/cabeleireiro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cabeleireiro),
  });
  return handleApiResponse<Cabeleireiro>(
    responseCabeleireiro,
    "criar Cabeleireiro",
  );
};

export const getCabeleireiroPage = async (
  page: number,
  limit: number,
  includeRelations: boolean = false,
  mostrarDesativados: boolean,
  salaoId?: string,
  nome?: string | null,
) => {
  let responseCabeleireiros = await fetch(
    CabeleireiroURL +
      `/cabeleireiro/page?page=${page}&limit=${limit}&includeRelations=${includeRelations}` +
      `&mostrarDesativados=${mostrarDesativados}` +
      `${salaoId ? "&salaoID=" + String(salaoId) : ""}` +
      `${nome ? "&nome=" + String(nome) : ""}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Cabeleireiro[]>(
    responseCabeleireiros,
    "buscar Cabeleireiros paginados",
  );
};

export const getCabeleireiroNomesPage = async (
  page: number,
  limit: number,
  salaoId: string,
  nome?: string | null,
) => {
  let responseCabeleireiros = await fetch(
    CabeleireiroURL +
      `/cabeleireiro/nomes/page?page=${page}&limit=${limit}` +
      `${salaoId ? "&salaoID=" + String(salaoId) : ""}` +
      `${nome ? "&nome=" + String(nome) : ""}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Cabeleireiro[]>(
    responseCabeleireiros,
    "buscar nomes dos Cabeleireiros paginados",
  );
};

export const deleteCabeleireiro = async (id: string) => {
  const Auth_URL = process.env.AUTH_URL || "http://localhost:4001";
  let response = await fetch(
    Auth_URL + `/cabeleireiro/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let result: any = null;
  try {
    result = await response.json();
  } catch (e) {
    throw new Error("Erro inesperado ao deletar/desativar cabeleireiro.");
  }
  if (response.ok) {
    if (result.details) {
      if (result.details.cabeleireiroDeleted) {
        return {
          status: "DELETADO",
          message: result.message || "Cabeleireiro deletado com sucesso.",
          details: result.details,
        };
      } else if (result.details.cabeleireiroDeactivated) {
        return {
          status: "DESATIVADO",
          message: result.message || "Cabeleireiro desativado.",
          details: result.details,
        };
      }
    }
    return {
      status: "SUCESSO",
      message: result.message || "Operação realizada.",
      details: result.details || {},
    };
  } else {
    throw new Error(result.message || "Erro ao deletar/desativar cabeleireiro.");
  }
};

export const updateCabeleireiro = async (
  Email: string,
  CPF: string,
  Telefone: string,
  SalaoId: string,
  Mei: string | undefined,
  Nome: string,
  ID: string | undefined,
) => {
  let responseCabeleireiro = await fetch(CabeleireiroURL + "/cabeleireiro", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Email, CPF, Telefone, SalaoId, Mei, Nome, ID }),
  });
  return handleApiResponse<Cabeleireiro>(
    responseCabeleireiro,
    "update Cabeleireiro",
  );
};

export const getCabeleireiroById = async (
  id: string,
  includeRelations: boolean,
) => {
  let responseCabeleireiro = await fetch(
    CabeleireiroURL +
      `/cabeleireiro/ID/${id}?includeRelations=${includeRelations}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Cabeleireiro>(
    responseCabeleireiro,
    "buscar Cabeleireiro por Id",
  );
};

export const getCabeleireiroBySalao = async (
  salaoId: string,
  includeRelations: boolean,
) => {
  let responseCabeleireiro = await fetch(
    CabeleireiroURL +
      `/cabeleireiro/salao/${salaoId}?includeRelations=${includeRelations}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Cabeleireiro[]>(
    responseCabeleireiro,
    "buscar Cabeleireiros por Salao",
  );
};
