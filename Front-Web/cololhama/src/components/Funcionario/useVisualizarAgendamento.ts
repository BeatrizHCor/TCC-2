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
  const [loading, setLoading] = useState<boolean>(false);
  const [totalAgendamentos, setTotalAgendamentos] = useState<number>(0);
  const [limitePorPagina, setLimitePorPagina] = useState<number>(10);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const carregarAgendamentos = async () => {
    if (!salaoId) return;

    setLoading(true);
    try {
      const diaValido = dia !== undefined && dia >= 1 && dia <= 31 ? dia : 0;
      const mesValido = mes !== undefined && mes >= 1 && mes <= 12 ? mes + 1 : 0;
      const anoValido = ano !== undefined && ano >= 1900 ? ano : 0;
      console.log("Valores de d,m,a: ", diaValido, mesValido, anoValido);
      const resultado = await AgendamentoService.getAgendamentosPaginados(
        page,
        limit,
        salaoId,
        anoValido,
        mesValido,
        diaValido,
        true,
      );console.log("resultado : ", resultado.data)
      setAgendamentos(resultado.data);
      setTotalAgendamentos(resultado.total);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      carregarAgendamentos();
    }, 500); 

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [page, limit, salaoId, dia, mes, ano]);

  return {
    agendamentos,
    loading,
    totalAgendamentos,
    limitePorPagina,
    setLimitePorPagina,
    recarregar: carregarAgendamentos
  };
};