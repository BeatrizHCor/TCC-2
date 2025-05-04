import { Cabeleireiro } from "../models/cabelereiroModel";
import "dotenv/config";

const CabeleireiroURL = process.env.CABELEREIRO_URL || "http://localhost:4002";

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
  salaoId: number,
  name: string | null
) => {
  console.log(CabeleireiroURL);
  let responseCabeleireiros = await fetch(
    CabeleireiroURL +
      `/cabeleireiro/page?page=${page}&limit=${limit}&includeRelations=${includeRelations}&salaoId=${salaoId}&name=${name}`,
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

export const deleteCabeleireiro = async (id: string) => {
  let responseCabeleireiro = await fetch(
    CabeleireiroURL + `/cabeleireiro/delete/${id}`,
    {
      method: "DELETE",
    }
  );
  if (responseCabeleireiro.ok) {
    return (await responseCabeleireiro.json()) as Cabeleireiro;
  } else {
    throw new Error("Error in deleting Cabeleireiro");
  }
};

export const updateCabeleireiro = async (
  Email: string,
  CPF: string,
  Telefone: string,
  SalaoId: string,
  Mei: string | undefined,
  Nome: string,
  ID: string | undefined
) => {
  let responseCabeleireiro = await fetch(CabeleireiroURL + "/cabeleireiro", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Email, CPF, Telefone, SalaoId, Mei, Nome, ID }),
  });
  if (responseCabeleireiro.ok) {
    return (await responseCabeleireiro.json()) as Cabeleireiro;
  } else {
    throw new Error("Error in updating Cabeleireiro");
  }
};

export const getCabeleireiroById = async (
  id: string,
  includeRelations: boolean
) => {
  let responseCabeleireiro = await fetch(
    CabeleireiroURL + `/cabeleireiro/ID/${id}`,
    {
      method: "GET",
    }
  );
  if (responseCabeleireiro.ok) {
    return (await responseCabeleireiro.json()) as Cabeleireiro;
  } else {
    throw new Error("Error in getting Cabeleireiro by ID");
  }
};
