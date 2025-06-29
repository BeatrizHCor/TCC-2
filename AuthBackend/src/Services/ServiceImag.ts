import "dotenv/config";
import { Portfolio } from "@prisma/client";
import { handleApiResponse } from "../utils/HandlerDeRespostaDoBackend";
const VITE_IMAGEM_URL = process.env.VITE_IMAGEM_URL || "http://localhost:4000";

export const createPortfolio = async (
  cabeleireiroId: string,
  Descricao: string,
  SalaoId: string,
) => {
  let responsePortfolio = await fetch(VITE_IMAGEM_URL + "/portfolio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      CabeleireiroId: cabeleireiroId,
      Descricao: Descricao,
      SalaoId: SalaoId,
    }),
  });
  return handleApiResponse<Portfolio>(
    responsePortfolio,
    "criar portfolio",
  );
};
export const deletePortfolio = async (id: string) => {
  let responsePortfolio = await fetch(
    VITE_IMAGEM_URL + "/portfolio/delete/" + id,
    {
      method: "DELETE",
    },
  );
  return handleApiResponse<Portfolio>(
    responsePortfolio,
    "deletar portfolio pelo id do cabelereiro",
  );
};

export const getPortfolioByCabeleireiroId = async (id: string) => {
  let responsePortfolio = await fetch(
    VITE_IMAGEM_URL + `/portfolio/info/cabeleireiro/${id}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Portfolio>(
    responsePortfolio,
    "buscar portfolio pelo id do cabeleireiro",
  );
};
