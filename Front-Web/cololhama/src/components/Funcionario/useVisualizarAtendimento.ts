import { useState, useEffect } from "react";
import { Atendimento } from "../../models/atendimentoModal";
import AtendimentoService from "../../services/AtendimentoService";
import { useNavigate } from "react-router-dom";
import { userTypes } from "../../models/tipo-usuario.enum";

interface AtendimentoExibicao {
  ID: string;
  NomeCliente: string;
  NomeCabeleireiro: string;
  Data: string;
  Hora: string;
  ValorTotal: number;
  QuantidadeServicos: number;
}

interface UseVisualizarAtendimentosResult {
  atendimentos: AtendimentoExibicao[];
  totalAtendimentos: number;
  isLoading: boolean;
  error: string | null;
  forbidden: boolean;
  handleEditarAtendimento: (atendimentoId: string) => void;
}

export const useVisualizarAtendimentos = (
  page: number = 1,
  limit: number = 10,
  clienteFilter: string = "",
  cabelereiroFilter: string = "",
  dataFilter: string = "",
  salaoId: string,
  userType: string,
  userId: string
): UseVisualizarAtendimentosResult => {
  const [atendimentos, setAtendimentos] = useState<AtendimentoExibicao[]>([]);
  const [átendimentosData, setAtendimentosData] = useState<Atendimento[]>([]);
  const [totalAtendimentos, setTotalAtendimentos] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarAtendimentos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        if (
          userType === userTypes.AdmSalao ||
          userType === userTypes.AdmSistema ||
          userType === userTypes.Funcionario
        ) {
          response = await AtendimentoService.getAtendimentosPageFuncionario(
            page,
            limit,
            clienteFilter,
            cabelereiroFilter,
            dataFilter,
            salaoId
          );
        } else if (userType === userTypes.Cabeleireiro) {
          response = await AtendimentoService.getAtendimentosPageCabeleireiro(
            page,
            limit,
            clienteFilter,
            dataFilter,
            userId,
            salaoId
          );
        } else if (userType === userTypes.Cliente) {
          response = await AtendimentoService.getAtendimentosPageCliente(
            page,
            limit,
            cabelereiroFilter,
            dataFilter,
            userId,
            salaoId
          );
        }
        console.log(response);
        setAtendimentosData(response.data);
        const listaAtendimentos: AtendimentoExibicao[] = (
          response.data || []
        ).map((item: any) => ({
          ID: item.ID ?? "",
          NomeCliente: item.Agendamentos[0]?.Cliente.Nome ?? "",
          NomeCabeleireiro: item.Agendamentos[0]?.Cabeleireiro.Nome ?? "",
          Data: item.Data ?? "",
          Hora: item.Data
            ? new Date(item.Data).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          ValorTotal: item.PrecoTotal ?? 0,
          QuantidadeServicos: item.ServicoAtendimento?.length ?? 0,
        }));
        setAtendimentos(listaAtendimentos);
        setTotalAtendimentos(response.total);
      } catch (err: any) {
        if (err?.response?.status === 403) {
          setForbidden(true);
        } else {
          setError(
            err instanceof Error ? err.message : "Erro ao buscar atendimentos"
          );
          console.error("Erro ao buscar atendimentos:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    buscarAtendimentos();
  }, [
    page,
    limit,
    clienteFilter,
    cabelereiroFilter,
    dataFilter,
    salaoId,
    userType,
    userId,
  ]);

  const handleEditarAtendimento = (atendimentoId: string) => {
    let atendimento = átendimentosData.find((at) => at.ID === atendimentoId)!;
    console.log(atendimento);
    navigate(`/atendimento/editar/${atendimento.ID}`, {
      state: {
        data: atendimento.Data,
        status: atendimento.Agendamentos[0].Status,
        servicosAgendamento: atendimento.Agendamentos[0].ServicoAgendamento,
        cabeleireiroId: atendimento.Agendamentos[0].CabeleireiroID,
        cabeleireiroNome: atendimento.Agendamentos[0].Cabeleireiro?.Nome,
        clienteId: atendimento.Agendamentos[0].ClienteID,
        clienteNome: atendimento.Agendamentos[0].Cliente?.Nome,
        agendamentoId: atendimento.Agendamentos[0].ID,
      },
    });
  };

  return {
    atendimentos,
    totalAtendimentos,
    isLoading,
    error,
    handleEditarAtendimento,
    forbidden,
  };
};
