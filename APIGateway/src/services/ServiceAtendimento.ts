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
  cabeleireiro: string | null,
) => {
  let responseAgendamentos = await fetch(
    FuncionarioURL +
      `/atendimento/page?page=${page}&limit=${limit}&salaoId=${salaoId}&data=${data}&includeRelations=${includeRelations}${
        cliente ? `&cliente=${cliente}` : ""
      }${cabeleireiro ? `&cabeleireiro=${cabeleireiro}` : ""}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Agendamentos[]>(
    responseAgendamentos,
    "buscar atendimentos",
  );
};

export const ClientegetAtendimentosPage = async (
  page: number,
  limit: number,
  includeRelations: boolean = false,
  salaoId: number,
  data: string,
  userId: string,
  cabeleireiro: string | null,
) => {
  console.log(
    ClienteURL +
      `/atendimento/page?page=${page}&limit=${limit}&userId=${userId}&salaoId=${salaoId}&data=${data}&includeRelations=${includeRelations}${
        cabeleireiro ? `&cabeleireiro=${cabeleireiro}` : ""
      }`,
  );
  let responseAtendimento = await fetch(
    ClienteURL +
      `/atendimento/page?page=${page}&limit=${limit}&userId=${userId}&salaoId=${salaoId}&data=${data}&includeRelations=${includeRelations}${
        cabeleireiro ? `&cabeleireiro=${cabeleireiro}` : ""
      }`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Atendimento[]>(
    responseAtendimento,
    "buscar atendimentos",
  );
};

export const getAtendimentobyAgendamentoId = async (agendamentoId: string) => {
  let response = await fetch(
    FuncionarioURL + `/atendimentobyagendamento/${agendamentoId}`,
    {
      method: "GET",
    },
  );
  if (response.ok) {
    return (await response.json()) as Atendimento;
  } else {
    throw new Error("Erro ao buscar agendamento por ID");
  }
};
export const FuncionariogetAtendimentobyId = async (atendimentoId: string) => {
  let response = await fetch(
    FuncionarioURL + `/atendimento/ID/${atendimentoId}`,
    {
      method: "GET",
    },
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
  AgendamentoID: string,
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

export const postAtendimentoCabeleireiro = async (
  Data: Date,
  PrecoTotal: number,
  Auxiliar: boolean,
  SalaoId: string,
  servicosAtendimento: ServicoAtendimento[] = [],
  auxiliares: AtendimentoAuxiliar[] = [],
  AgendamentoID: string,
) => {
  let response = await fetch(CabeleireiroURL + `/atendimento`, {
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
  status: ServicoAtendimento,
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

export const putAtendimentoCabeleireiro = async (
  AtendimentoId: string,
  Data: Date,
  PrecoTotal: number,
  Auxiliar: boolean,
  SalaoId: string,
  servicosAtendimento: ServicoAtendimento[] = [],
  auxiliares: AtendimentoAuxiliar[] = [],
  AgendamentoID: string,
  status: ServicoAtendimento,
) => {
  let response = await fetch(
    CabeleireiroURL + `/atendimento/${AtendimentoId}`,
    {
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
    },
  );
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

export const CabeleireiroDeleteAtendimento = async (id: string) => {
  let response = await fetch(CabeleireiroURL + `/atendimento/delete/${id}`, {
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
  userId: string,
  cliente: string | null,
) => {
  let responseAtendimentos = await fetch(
    CabeleireiroURL +
      `/atendimento/page?page=${page}&limit=${limit}&userId=${userId}&salaoId=${salaoId}&data=${data}&includeRelations=${includeRelations}${
        cliente ? `&cliente=${cliente}` : ""
      }`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Agendamentos[]>(
    responseAtendimentos,
    "buscar atendimentos",
  );
}
export const CabeleireirogetAtendimentobyId = async (atendimentoId: string) => {
  let response = await fetch(
    CabeleireiroURL + `/atendimento/ID/${atendimentoId}`,
    {
      method: "GET",
    },
  );
  if (response.ok) {
    return (await response.json()) as Atendimento;
  } else {
    throw new Error("Erro ao buscar agendamento por ID");
  }
};
//-----Cliente

export const ClientegetAtendimentobyId = async (atendimentoId: string) => {
  let response = await fetch(
    ClienteURL + `/atendimento/ID/${atendimentoId}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Agendamentos[]>(
    response,
    "buscar atendimentos",
  );
};
