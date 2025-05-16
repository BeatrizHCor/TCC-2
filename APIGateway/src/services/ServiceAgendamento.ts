import { Agendamentos } from "../models/agendamentoModel";
import "dotenv/config";

const CabeleireiroURL = process.env.CABELEREIRO_URL || "http://localhost:4002";

export const postAgendamento = async (
    Data: Date, 
    ClienteID: string, 
    SalaoId: string, 
    CabeleireiroID: string
) => {
    let responseAgendamento = await fetch(CabeleireiroURL + "/agendamento", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Data,
      ClienteID,
      SalaoId,
      CabeleireiroID
    }),
  });
  if(responseAgendamento.ok) {
    return (await responseAgendamento.json()) as Agendamentos;
  } else {
    throw new Error("Erro fazendo agendamento");
  }
}

export const getAgendamentosPage = async (
    page: number,
    limit: number,
    includeRelations: boolean = false,
    salaoId: number,
    dia:number, 
    mes:number, 
    ano:number
) => {
    console.log(CabeleireiroURL);
    let responseAgendamentos = await fetch(
        CabeleireiroURL +
            `/agendamento/page?page=${page}&limit=${limit}&salaoId=${salaoId}&dia=${dia}&mes=${mes}&ano=${ano}}&includeRelations=${includeRelations}`,
        {
            method: "GET",
        }
    );
    if (responseAgendamentos.ok) {
        return (await responseAgendamentos.json()) as Agendamentos[];
    } else {
        throw new Error("Error in fetching Agendamentos");
    }
};
