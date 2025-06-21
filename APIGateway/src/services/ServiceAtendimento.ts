import { Agendamentos } from "../models/agendamentoModel";
import "dotenv/config";
import { ServicoAtendimento } from "../models/servicoAtendimentoModel";
import { AtendimentoAuxiliar } from "../models/atendimentoAuxiliarModel";
import { Atendimento } from "../models/atendimentoModal";
import { handleApiResponse } from "../utils/HandlerDeRespostaDoBackend";

const FuncionarioURL = process.env.FUNC_URL || "http://localhost:3002";
const CabeleireiroURL = process.env.CABELEREIRO_URL || "http://localhost:3005";
const ClienteURL = process.env.CUSTOMER_URL || "http://localhost:3001";

export const FuncionariogetAtendimentosPage = async (
  page: number,
  limit: number,
  includeRelations: boolean = false,
  salaoId: number,
  data: string,
  cliente: string | null,
  cabeleireiro: string | null
) => {
  console.log(
    FuncionarioURL +
      `/atendimento/page?page=${page}&limit=${limit}&salaoId=${salaoId}&data=${data}&includeRelations=${includeRelations}${
        cliente ? `&cliente=${cliente}` : ""
      }${cabeleireiro ? `&cliente=${cabeleireiro}` : ""}`
  );
  let responseAgendamentos = await fetch(
    FuncionarioURL +
      `/atendimento/page?page=${page}&limit=${limit}&salaoId=${salaoId}&data=${data}&includeRelations=${includeRelations}${
        cliente ? `&cliente=${cliente}` : ""
      }${cabeleireiro ? `&cabeleireiro=${cabeleireiro}` : ""}`,
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

export const getAtendimentobyAgendamentoId = async (agendamentoId: string) => {
  let response = await fetch(
    FuncionarioURL + `/atendimentobyagendamento/${agendamentoId}`,
    {
      method: "GET",
    }
  );
  if (response.ok) {
    return (await response.json()) as Atendimento;
  } else {
    throw new Error("Erro ao buscar agendamento por ID");
  }
};

export const postAtendimentoFuncionario = async (
  Data: Date,
  PrecoTotal: number,
  Auxiliar: boolean,
  SalaoId: string,
  servicosAtendimento: ServicoAtendimento[] = [],
  auxiliares: AtendimentoAuxiliar[] = [],
  AgendamentoID: string
) => {
  let response = await fetch(FuncionarioURL + `/atendimento`, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Data,
      PrecoTotal,
      Auxiliar,
      SalaoId,
      servicosAtendimento,
      auxiliares,
      AgendamentoID,
    }),
  });
  if (response.ok) {
    return (await response.json()) as Atendimento;
  } else {
    throw new Error("Erro ao buscar agendamento por ID");
  }
};

export const putAtendimentoFuncionario = async (
  AtendimentoId: string,
  Data: Date,
  PrecoTotal: number,
  Auxiliar: boolean,
  SalaoId: string,
  servicosAtendimento: ServicoAtendimento[] = [],
  auxiliares: AtendimentoAuxiliar[] = [],
  AgendamentoID: string,
  status: ServicoAtendimento
) => {
  let response = await fetch(FuncionarioURL + `/atendimento/${AtendimentoId}`, {
    method: "Put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Data,
      PrecoTotal,
      Auxiliar,
      SalaoId,
      servicosAtendimento,
      auxiliares,
      AgendamentoID,
      status,
    }),
  });
  if (response.ok) {
    return (await response.json()) as Atendimento;
  } else {
    throw new Error("Erro ao buscar agendamento por ID");
  }
};

export const FuncionarioDeleteAtendimento = async (id: string) => {
  let response = await fetch(FuncionarioURL + `/atendimento/delete/${id}`, {
    method: "DELETE",
  });
  if (response.status === 204) {
    return true;
  }
  return handleApiResponse<Agendamentos>(response, "deletar atendimento");
};
//-----Cabeleireiro
export const CabeleireirogetAtendimentosPage = async (
  page: number,
  limit: number,
  includeRelations: boolean = false,
  salaoId: number,
  data: string,
  userId: string
) => {
  let responseAtendimentos = await fetch(
    CabeleireiroURL +
      `/atendimento/page?page=${page}&limit=${limit}&userId=${userId}&salaoId=${salaoId}&data=${data}&includeRelations=${includeRelations}`,
    {
      method: "GET",
    }
  );
  console.log(responseAtendimentos);
  if (responseAtendimentos.ok) {
    return (await responseAtendimentos.json()) as Agendamentos[];
  } else {
    throw new Error("Error in fetching Agendamentos");
  }
};
