import { useState, useCallback } from 'react';
import { 
  HistoricoService, 
  HistoricoSimulacao, 
  SaveSimulationRequest 
} from '../../services/HistóricoSimulacaoService';

import { ResultsType } from '../../services/IAService';

export interface UseHistoricoReturn {
  historico: HistoricoSimulacao[];
  loading: boolean;
  error: string | null;
  saveLoading: boolean;
  saveSuccess: boolean;

  saveSimulation: (clienteId: string, salaoId: string, resultados: ResultsType) => Promise<boolean>;
  loadHistoricoCliente: (clienteId: string) => Promise<void>;
  loadHistoricoSalao: (salaoId: string) => Promise<void>;
  deleteSimulation: (historicoId: string) => Promise<boolean>;
  clearError: () => void;
  clearSaveStatus: () => void;
}

export const useHistorico = (): UseHistoricoReturn => {
  const [historico, setHistorico] = useState<HistoricoSimulacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSaveStatus = useCallback(() => {
    setSaveSuccess(false);
    setError(null);
  }, []);

  const saveSimulation = useCallback(async (
    clienteId: string, 
    salaoId: string, 
    resultados: ResultsType
  ): Promise<boolean> => {
    setSaveLoading(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const request: SaveSimulationRequest = {
        clienteId,
        salaoId,
        resultados,
      };

      const response = await HistoricoService.saveSimulation(request);

      if (response.success) {
        setSaveSuccess(true);
        return true;
      } else {
        setError(response.error || 'Erro ao salvar simulação');
        return false;
      }
    } catch (error: any) {
      setError(`Erro inesperado: ${error.message}`);
      return false;
    } finally {
      setSaveLoading(false);
    }
  }, []);

  const loadHistoricoCliente = useCallback(async (clienteId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await HistoricoService.getHistoricoCliente(clienteId);

      if (response.success && response.data) {
        setHistorico(response.data);
      } else {
        setError(response.error || 'Erro ao carregar histórico');
        setHistorico([]);
      }
    } catch (error: any) {
      setError(`Erro inesperado: ${error.message}`);
      setHistorico([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistoricoSalao = useCallback(async (salaoId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await HistoricoService.getHistoricoSalao(salaoId);

      if (response.success && response.data) {
        setHistorico(response.data);
      } else {
        setError(response.error || 'Erro ao carregar histórico do salão');
        setHistorico([]);
      }
    } catch (error: any) {
      setError(`Erro inesperado: ${error.message}`);
      setHistorico([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSimulation = useCallback(async (historicoId: string): Promise<boolean> => {
    setError(null);

    try {
      const response = await HistoricoService.deleteSimulation(historicoId);

      if (response.success) {
        setHistorico(prev => prev.filter(item => item.ID !== historicoId));
        return true;
      } else {
        setError(response.error || 'Erro ao deletar simulação');
        return false;
      }
    } catch (error: any) {
      setError(`Erro inesperado: ${error.message}`);
      return false;
    }
  }, []);

  return {
    historico,
    loading,
    error,
    saveLoading,
    saveSuccess,
    saveSimulation,
    loadHistoricoCliente,
    loadHistoricoSalao,
    deleteSimulation,
    clearError,
    clearSaveStatus,
  };
};