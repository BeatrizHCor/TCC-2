import { Cabeleireiro } from "../models/cabelereiroModel";
import "dotenv/config";
import { Portfolio } from "../models/portifolioModel";

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
  if (responsePortfolio.ok) {
    return (await responsePortfolio.json()) as Portfolio;
  } else {
    throw new Error("Error in creating Portfolio");
  }
};

export const deletePortfolio = async (cabeleireiroId: string) => {
  let responsePortfolio = await fetch(VITE_IMAGEM_URL + "/portfolio/delete/" + cabeleireiroId, {
    method: "DELETE",
  });
  if (responsePortfolio.ok) {
    return (await responsePortfolio.json()) as Portfolio;
  } else {
    throw new Error("Error in deleting Portfolio");
  }
}