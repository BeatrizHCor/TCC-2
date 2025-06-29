import "dotenv/config";
import { Cabeleireiro, StatusCadastro } from "@prisma/client";
import { handleApiResponse } from "../utils/HandlerDeRespostaDoBackend";

const CabeleireiroURL = process.env.CABELEREIRO_URL || "http://localhost:7779";

export const postCabeleireiro = async (
  CPF: string,
  Nome: string,
  Email: string,
  Telefone: string,
  SalaoId: string,
  Mei: string,
  ID?: string | undefined,
) => {
  let responseCabeleireiro = await fetch(CabeleireiroURL + "/cabeleireiro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Email: Email,
      CPF: CPF,
      Telefone: Telefone,
      SalaoId: SalaoId,
      Mei: Mei,
      Nome: Nome,
      ID: ID ? ID : undefined,
    }),
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
  salaoId?: number,
  nome?: string | null,
) => {
  let responseCabeleireiros = await fetch(
    CabeleireiroURL +
      `/cabeleireiro/page?page=${page}&limit=${limit}&includeRelations=${includeRelations}` +
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

export const deleteCabeleireiro = async (id: string) => {
  let responseCabeleireiro = await fetch(
    CabeleireiroURL + `/cabeleireiro/delete/${id}`,
    {
      method: "DELETE",
    },
  );
  if (responseCabeleireiro.ok) {
    return true;
  } else if (responseCabeleireiro.status === 409) {
    const data = await responseCabeleireiro.json().catch(() => ({}));
    const msg = data && data.message
      ? data.message
      : "Não é possível excluir: cabeleireiro está em uso.";
    throw new Error(msg);
  } else {
    return handleApiResponse<Cabeleireiro>(
      responseCabeleireiro,
      "deletar Cabeleireiro",
    );
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
  Status?: StatusCadastro,
) => {
  let responseCabeleireiro = await fetch(CabeleireiroURL + "/cabeleireiro", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Email,
      CPF,
      Telefone,
      SalaoId,
      Mei,
      Nome,
      ID,
      Status,
    }),
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
