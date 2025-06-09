import { useState, useEffect, useRef } from 'react';
import AgendamentoService from '../../services/AgendamentoService';
import { Agendamentos } from '../../models/agendamentoModel';

export const useVisualizarAgendamentos = (
  page: number = 1,
  limit: number = 10,
  salaoId: string,
  dia?: number,
  mes?: number,
  ano?: number
) => {
  const [agendamentos, setAgendamentos] = useState<Agendamentos[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalAgendamentos, setTotalAgendamentos] = useState(0);
  const [limitePorPagina, setLimitePorPagina] = useState(limit);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const dataValida = {
    dia: dia && dia >= 1 && dia <= 31 ? dia : undefined,
    mes: mes && mes >= 1 && mes <= 12 ? mes : undefined,
    ano: ano && ano >= 1900 ? ano : undefined,
  };

  const fetchAgendamentos = async () => {
    if (!salaoId) return;

    setLoading(true);

    try {
      const resultado = await AgendamentoService.getAgendamentosPaginados(
        page,
        limitePorPagina,
        salaoId,
        dataValida.ano ?? 0,
        (dataValida.mes ?? 0) + 1,
        dataValida.dia ?? 0,
        true
      );

      console.log("Agendamentos carregados:", resultado.data);
      setAgendamentos(resultado.data);
      setTotalAgendamentos(resultado.total);

    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchAgendamentos();
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [page, limitePorPagina, salaoId, dia, mes, ano]);

  return {
    agendamentos,
    loading,
    totalAgendamentos,
    limitePorPagina,
    setLimitePorPagina,
    recarregar: fetchAgendamentos
  };
};
