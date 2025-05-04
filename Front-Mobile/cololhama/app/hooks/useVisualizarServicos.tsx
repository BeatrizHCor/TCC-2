import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import ServicoService from '../services/ServicoService';
import { Servico } from '../models/servicoModel';

export const useVisualizarServicos = (
  page: number,
  limit: number,
  salaoId: string,
  nomeFilter: string,
  precoMinFilter: number | '',
  precoMaxFilter: number | ''
) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [totalServicos, setTotalServicos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await ServicoService.getServicosPaginados(
          page,
          limit,
          salaoId,
          nomeFilter || undefined,
          precoMinFilter,
          precoMaxFilter
        );

        console.log('Serviços retornados:', response.data);  // Verificando dados recebidos
        
        setServicos(response.data);
        setTotalServicos(response.total);
      } catch (err) {
        console.error('Erro ao buscar serviços:', err);
        setError('Falha ao carregar serviços. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicos();
  }, [page, limit, salaoId, nomeFilter, precoMinFilter, precoMaxFilter]);

  const handleEditarServico = (id: string) => {
    //router.push(`/servicos/editar/${id}`);
  };

  return { servicos, totalServicos, isLoading, error, handleEditarServico };
};
