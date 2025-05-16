import { useState, useEffect } from 'react';
import AgendamentoService from '../../services/AgendamentoService';
import { Agendamentos } from '../../models/agendamentoModel';

export const useVisualizarAgendamentos = (salaoId: string, dataFiltro: Date | null) => {
  const [agendamentos, setAgendamentos] = useState<Agendamentos[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalAgendamentos, setTotalAgendamentos] = useState<number>(0);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [limitePorPagina, setLimitePorPagina] = useState<number>(10);

 
  const carregarAgendamentos = async () => {
    if (!salaoId) return;
    
    setLoading(true);
    try {
    
      const ano = dataFiltro !== null ? dataFiltro.getFullYear() : undefined;
      const mes = dataFiltro !== null ? dataFiltro.getMonth() + 1 : undefined;
      const dia = dataFiltro !== null ? dataFiltro.getDate() : undefined;
      console.log("Valores de d,m,a: ", dia, mes,ano);
      const resultado = await AgendamentoService.getAgendamentosPaginados(
        paginaAtual,
        limitePorPagina,
        salaoId,
        ano,
        mes,
        dia,
        true
      );
      
      setAgendamentos(resultado.data);
      setTotalAgendamentos(resultado.total);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, [salaoId, dataFiltro, paginaAtual, limitePorPagina]);

  return {
    agendamentos,
    loading,
    totalAgendamentos,
    paginaAtual,
    setPaginaAtual,
    limitePorPagina,
    setLimitePorPagina,
    recarregar: carregarAgendamentos
  };
};