import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Agendamentos } from "../../models/agendamentoModel";
import AgendamentoService from "../../services/AgendamentoService";
import { userTypes } from "../../models/tipo-usuario.enum";

interface AgendamentoExibicao extends Agendamentos {}

interface UseVisualizarAgendamentosResult {
  agendamentos: AgendamentoExibicao[];
  totalAgendamentos: number;
  isLoading: boolean;
  error: string | null;
  forbidden: boolean;
}

export const useVisualizarAgendamentos = (
  page: number = 1,
  limit: number = 10,
  salaoId: string,
  userType: userTypes,
  userId: string,
  dia?: number,
  mes?: number,
  ano?: number
): UseVisualizarAgendamentosResult => {
  const [agendamentos, setAgendamentos] = useState<AgendamentoExibicao[]>([]);
  const [totalAgendamentos, setTotalAgendamentos] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState<boolean>(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dataValida = {
    dia: dia && dia >= 1 && dia <= 31 ? dia : 0,
    mes: mes && mes >= 1 && mes <= 12 ? mes : 0,
    ano: ano && ano >= 1900 ? ano : 0,
  };

  useEffect(() => {
    const buscarAgendamentos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        if ([userTypes.AdmSistema, userTypes.AdmSalao, userTypes.Funcionario].includes(userType)) {
          response = await AgendamentoService.FuncionariogetAgendamentosPaginados(
            page,
            limit,
            salaoId,
            dataValida.ano,
            dataValida.mes + 1,
            dataValida.dia,
            true
          );
        } else if (userType === userTypes.Cabeleireiro) {
          response = await AgendamentoService.CabeleireirogetAgendamentosPaginados(
            page,
            limit,
            salaoId,
            dataValida.ano,
            dataValida.mes + 1,
            dataValida.dia
          );
        } else if (userType === userTypes.Cliente) {
          response = await AgendamentoService.ClientegetAgendamentosPaginados(
            page,
            limit,
            salaoId,
            dataValida.ano,
            dataValida.mes + 1,
            dataValida.dia
          );
        }

        setAgendamentos(response?.data || []);
        setTotalAgendamentos(response?.total || 0);

      } catch (err: any) {
        if (err?.response?.status === 403) {
          setForbidden(true);
        } else {
          setError(err instanceof Error ? err.message : "Erro ao buscar agendamentos");
          console.error("Erro ao buscar agendamentos:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
    buscarAgendamentos();
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };

  }, [page, limit, salaoId, userType, userId, dia, mes, ano]);

  return {
    agendamentos,
    totalAgendamentos,
    isLoading,
    error,
    forbidden
  };
};