import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Servico } from '../../models/servicoModel';
import ServicoService from '../../services/ServicoService';

interface UseVisualizarServicosResult {
  servicos: Servico[];
  totalServicos: number;
  isLoading: boolean;
  error: string | null;
  handleEditarServico: (servicoId: string) => void;
}
export const useVisualizarServicos = (
  page: number, 
  limit: number, 
  salaoId: string,
  nomeFilter: string = '',
  precoMinFilter: number | '' = '',
  precoMaxFilter: number | '' = ''
): UseVisualizarServicosResult => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [totalServicos, setTotalServicos] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchServicos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ServicoService.getServicosPaginados(
          page,
          limit,
          salaoId,
          nomeFilter,
          precoMinFilter !== '' ? precoMinFilter : undefined,
          precoMaxFilter !== '' ? precoMaxFilter : undefined
        );

        const servicosFormatados: Servico[] = (response.data || []).map((item: any) => ({
          ID: item.ID ?? "",
          SalaoId: item.SalaoId ?? "",
          Nome: item.Nome ?? "",
          Descricao: item.Descricao ?? "",
          PrecoMin: item.PrecoMin ?? 0,
          PrecoMax: item.PrecoMax ?? 0,
        })
      );
        setServicos(servicosFormatados);
        setTotalServicos(response.total);
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
        setError("Não foi possível carregar os serviços. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
      fetchServicos();    
  }, [page, limit, salaoId, nomeFilter, precoMinFilter, precoMaxFilter]);

  const handleEditarServico = (servicoId: string) => {
   navigate(`/servico/editar/${servicoId}`);
  };

  return {
    servicos,
    totalServicos,
    isLoading,
    error,
    handleEditarServico
  };
};

export default useVisualizarServicos;