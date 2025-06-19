import { Cabeleireiro } from "../models/cabelereiroModel";
import "dotenv/config";
import { Portfolio } from "../models/portifolioModel";
import { handleApiResponse } from "../utils/HandlerDeRespostaDoBackend";
import { Imagem } from "../models/imagemModel";
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
  if (responsePortfolio.status === 204) {
    return true;
  } else {
    return handleApiResponse<Portfolio>(
      responsePortfolio,
      "deletar portfolio pelo id do cabelereiro",
    );
  }
};
export const getPortfolioByCabeleireriroId = async (cabeleireiroId: string) => {
  let responsePortfolio = await fetch(
    VITE_IMAGEM_URL + `/portfolio/${cabeleireiroId}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<any>(
    responsePortfolio,
    "buscar portfolio pelo id do cabeleireiro",
  );
};

export const getPortfolioImages = async (id: string) => {
  let responsePortfolio = await fetch(VITE_IMAGEM_URL + "/portfolio/ID/" + id, {
    method: "GET",
  });

  return handleApiResponse<Portfolio>(
    responsePortfolio,
    "buscar imagens do portfolio pelo id",
  );
};

export const getImagemById = async (id: string) => {
  let responsePortfolio = await fetch(VITE_IMAGEM_URL + "/imagem/ID/" + id, {
    method: "GET",
  });

  return handleApiResponse<Imagem>(
    responsePortfolio,
    "buscar imagem por ID",
  );
};
