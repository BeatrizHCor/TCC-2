import { Agendamentos } from "../models/agendamentoModel";
import "dotenv/config";
import { handleApiResponse } from "../utils/HandlerDeRespostaDoBackend";
const FuncionarioURL = process.env.FUNC_URL || "http://localhost:3002";
const CabeleireiroURL = process.env.CABELEREIRO_URL || "http://localhost:3005";
const ClienteURL = process.env.CUSTOMER_URL || "http://localhost:3001";

//-----Funcionario
export const FuncionarioPostAgendamento = async (
  Data: Date,
  ClienteID: string,
  CabeleireiroID: string,
  SalaoId: string,
  servicosIds: string[],
) => {
  let responseAgendamento = await fetch(FuncionarioURL + "/agendamento", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Data,
      ClienteID,
      CabeleireiroID,
      SalaoId,
      servicosIds,
    }),
  });
  return handleApiResponse<Agendamentos>(
    responseAgendamento,
    "criar agendamento",
  );
};

export const FuncionarioUpdateAgendamento = async (
  id: string,
  Data: string,
  Status: string,
  ClienteID: string,
  CabeleireiroID: string,
  SalaoId: string,
  servicosIds: string[],
) => {
  let response = await fetch(FuncionarioURL + `/agendamento/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Data,
      Status,
      ClienteID,
      CabeleireiroID,
      SalaoId,
      servicosIds,
    }),
  });
  return handleApiResponse<Agendamentos>(
    response,
    "atualizar agendamento",
  );
};

export const FuncionariogetAgendamentosPage = async (
  page: number | null,
  limit: number | null,
  includeRelations: boolean = false,
  salaoId: number,
  dia: number,
  mes: number,
  ano: number,
) => {
  let responseAgendamentos = await fetch(
    FuncionarioURL +
      `/agendamento/page?page=${page}&limit=${limit}&salaoId=${salaoId}&dia=${dia}&mes=${mes}&ano=${ano}&includeRelations=${includeRelations}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Agendamentos>(
    responseAgendamentos,
    "get agendamentos paginados",
  );
};

export const FuncionariogetAgendamentoById = async (
  id: string,
  includeRelations = false,
) => {
  let response = await fetch(
    FuncionarioURL +
      `/agendamento/ID/${id}?includeRelations=${includeRelations}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Agendamentos>(response, "buscar agendamento por ID");
};
export const FuncionarioDeleteAgendamento = async (id: string) => {
  let response = await fetch(FuncionarioURL + `/agendamento/delete/${id}`, {
    method: "DELETE",
  });
  if (response.status === 204) {
    return true;
  }
  return handleApiResponse<Agendamentos>(response, "deletar agendamento");
};
//-----Cabeleireiro
export const CabeleireiroPostAgendamento = async (
  Data: Date,
  ClienteID: string,
  CabeleireiroID: string,
  SalaoId: string,
  servicosIds: string[],
) => {
  let responseAgendamento = await fetch(CabeleireiroURL + "/agendamento", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Data,
      ClienteID,
      CabeleireiroID,
      SalaoId,
      servicosIds,
    }),
  });
  return handleApiResponse<Agendamentos>(
    responseAgendamento,
    "criar agendamento",
  );
};
export const CabeleireiroUpdateAgendamento = async (
  id: string,
  Data: string,
  Status: string,
  ClienteID: string,
  CabeleireiroID: string,
  SalaoId: string,
  servicosIds: string[],
) => {
  let response = await fetch(CabeleireiroURL + `/agendamento/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Data,
      Status,
      ClienteID,
      CabeleireiroID,
      SalaoId,
      servicosIds,
    }),
  });
  return handleApiResponse<Agendamentos>(
    response,
    "atualizar agendamento",
  );
};
export const CabeleireirogetAgendamentosPage = async (
  page: number | null,
  limit: number | null,
  includeRelations: boolean = false,
  salaoId: number,
  CabeleireiroId: string,
  dia: number,
  mes: number,
  ano: number,
) => {
  let responseAgendamentos = await fetch(
    CabeleireiroURL +
      `/agendamento/page?page=${page}&limit=${limit}&salaoId=${salaoId}&CabeleireiroId=${CabeleireiroId}&dia=${dia}&mes=${mes}&ano=${ano}&includeRelations=${includeRelations}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Agendamentos>(
    responseAgendamentos,
    "get agendamentos paginados",
  );
};
export const CabeleireirogetAgendamentoById = async (
  id: string,
  includeRelations = false,
) => {
  let response = await fetch(
    CabeleireiroURL +
      `/agendamento/ID/${id}?includeRelations=${includeRelations}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Agendamentos>(response, "buscar agendamento por ID");
};
export const CabeleireiroDeleteAgendamento = async (id: string) => {
  let response = await fetch(CabeleireiroURL + `/agendamento/delete/${id}`, {
    method: "DELETE",
  });
  if (response.status === 204) {
    return true;
  }
  return handleApiResponse<Agendamentos>(response, "deletar agendamento");
};

//-----Cliente
export const ClientePostAgendamento = async (
  Data: Date,
  ClienteID: string,
  CabeleireiroID: string,
  SalaoId: string,
  servicosIds: string[],
) => {
  let responseAgendamento = await fetch(ClienteURL + "/agendamento", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Data,
      ClienteID,
      CabeleireiroID,
      SalaoId,
      servicosIds,
    }),
  });
  return handleApiResponse<Agendamentos>(
    responseAgendamento,
    "criar agendamento",
  );
};
export const ClienteUpdateAgendamento = async (
  id: string,
  Data: string,
  Status: string,
  ClienteID: string,
  CabeleireiroID: string,
  SalaoId: string,
  servicosIds: string[],
) => {
  let response = await fetch(ClienteURL + `/agendamento/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Data,
      Status,
      ClienteID,
      CabeleireiroID,
      SalaoId,
      servicosIds,
    }),
  });
  return handleApiResponse<Agendamentos>(
    response,
    "atualizar agendamento",
  );
};
export const ClientegetAgendamentosPage = async (
  page: number | null,
  limit: number | null,
  includeRelations: boolean = false,
  salaoId: number,
  ClienteId: string,
  dia: number,
  mes: number,
  ano: number,
) => {
  let responseAgendamentos = await fetch(
    ClienteURL +
      `/agendamento/page?page=${page}&limit=${limit}&salaoId=${salaoId}&ClienteId=${ClienteId}&dia=${dia}&mes=${mes}&ano=${ano}&includeRelations=${includeRelations}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Agendamentos>(
    responseAgendamentos,
    "get agendamentos paginados",
  );
};
export const ClientegetAgendamentoById = async (
  id: string,
  includeRelations = false,
) => {
  let response = await fetch(
    ClienteURL + `/agendamento/ID/${id}?includeRelations=${includeRelations}`,
    {
      method: "GET",
    },
  );
  return handleApiResponse<Agendamentos>(response, "buscar agendamento por ID");
};

export const ClienteDeleteAgendamento = async (id: string) => {
  let response = await fetch(ClienteURL + `/agendamento/delete/${id}`, {
    method: "DELETE",
  });
  if (response.status === 204) {
    return true;
  }
  return handleApiResponse<Agendamentos>(response, "deletar agendamento");
};

export const getHorariosOcupadosFuturos = async (
  salaoId: string,
  cabeleireiroId: string,
  data: string,
) => {
  const url =
    `${ClienteURL}/agendamento/horarios/${salaoId}/${cabeleireiroId}?data=${
      encodeURIComponent(
        data,
      )
    }`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleApiResponse<[Date, number][]>(
    response,
    "busacar horários ocupados",
  );
};
