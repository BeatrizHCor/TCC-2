import { useState, useEffect } from 'react';
import { Cliente } from '../../models/clienteModel';
import ClienteService from '../../services/ClienteService';

export const useVisualizarClientes = (
  page: number = 1,
  limit: number = 10,
  salaoId: string
) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscarClientes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await ClienteService.getClientePage(
          page,
          limit,
          false, 
          salaoId
        );

        setClientes(response.data);
        setTotalClientes(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar clientes');
        console.error('Erro ao buscar clientes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    buscarClientes();
  }, [page, limit, salaoId]);

  return {
    clientes,
    totalClientes,
    isLoading,
    error,
  };
};