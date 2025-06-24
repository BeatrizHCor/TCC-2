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
    console.log("🔍 Hook - loadHistoricoCliente chamado com clienteId:", clienteId);
    
    if (!clienteId) {
      console.error("❌ Hook - clienteId é obrigatório");
      setError("ID do cliente é obrigatório");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("📞 Hook - Chamando HistoricoService.getHistoricoCliente...");
      const response = await HistoricoService.getHistoricoCliente(clienteId);

      console.log("📥 Hook - Resposta recebida do service:");
      console.log("- success:", response.success);
      console.log("- tem data?", !!response.data);
      console.log("- tipo de data:", typeof response.data);
      console.log("- data é array?", Array.isArray(response.data));
      
      if (Array.isArray(response.data)) {
        console.log("- tamanho do array:", response.data.length);
        console.log("- dados do array:", response.data);
        
        if (response.data.length > 0) {
          console.log("- primeiro item:", response.data[0]);
          console.log("- estrutura do primeiro item:");
          console.log("  - ID:", response.data[0].ID);
          console.log("  - Data:", response.data[0].Data);
          console.log("  - Cliente:", response.data[0].ClienteID);
          console.log("  - Salao:", response.data[0].SalaoId);
          console.log("  - imagens:", response.data[0].imagens);
        }
      }

      if (response.success && response.data) {
        console.log(`✅ Hook - Histórico encontrado com ${response.data.length} registros`);
        console.log("📋 Hook - Setando historico state com:", response.data);
        
        // ✅ CORREÇÃO: Usar setState com callback para garantir que o estado seja atualizado
        setHistorico(prevHistorico => {
          console.log("📝 Hook - Estado anterior:", prevHistorico);
          console.log("📝 Hook - Novo estado:", response.data);
          return response.data || [];
        });
        
        // ✅ CORREÇÃO: Verificar estado após um delay maior
        setTimeout(() => {
          console.log("🔍 Hook - Verificando estado após 500ms...");
        }, 500);
        
      } else if (response.success && (!response.data || response.data.length === 0)) {
        console.log("⚠️ Hook - Nenhum histórico encontrado para este cliente");
        setHistorico([]);
      } else {
        console.log("❌ Hook - Erro na resposta da API:", response.error);
        setHistorico([]);
        setError(response.error || "Erro ao carregar histórico");
      }
    } catch (error: any) {
      console.error("❌ Hook - Erro inesperado ao carregar histórico:", error);
      setHistorico([]);
      setError(`Erro inesperado: ${error.message}`);
    } finally {
      setLoading(false);
      console.log("🏁 Hook - loadHistoricoCliente finalizado");
    }
  }, []); // ✅ CORREÇÃO: Removido 'historico' da dependência para evitar loops

  const loadHistoricoSalao = useCallback(async (salaoId: string): Promise<void> => {
    console.log("🔍 Hook - loadHistoricoSalao chamado com salaoId:", salaoId);
    
    if (!salaoId) {
      setError("ID do salão é obrigatório");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await HistoricoService.getHistoricoSalao(salaoId);
      
      console.log("📥 Hook - Resposta salao:", response);

      if (response.success && response.data) {
        console.log(`✅ Hook - Histórico salao encontrado com ${response.data.length} registros`);
        setHistorico(response.data);
      } else if (response.success && (!response.data || response.data.length === 0)) {
        console.log("⚠️ Hook - Nenhum histórico encontrado para este salão");
        setHistorico([]);
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