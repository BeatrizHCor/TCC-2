// hooks/useSimulacao.ts (Atualizado)
import { useState, useRef, useCallback } from 'react';
import { IAService, ResultsType } from '../../services/IAService';
import { useHistorico } from './useHistorico';

export const useSimulacao = (userId: string | null, userType: string | null) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<ResultsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    saveSimulation,
    saveLoading,
    saveSuccess,
    clearSaveStatus,
    error: saveError
  } = useHistorico();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const validation = IAService.validateFile(file);
      
      if (!validation.isValid) {
        setError(validation.error || 'Arquivo inválido');
        return;
      }

      setError(null);
      IAService.createPreview(file)
        .then(setPreview)
        .catch(() => setError('Erro ao criar preview da imagem'));
    }
  }, []);

  const processImage = useCallback(async () => {
    if (!selectedFile) {
      setError('Nenhum arquivo selecionado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await IAService.processHairColor(selectedFile);
      
      if (response.success && response.data) {
        setResults(response.data);
        setPreview(null);
        
        // Se é cliente, mostra opção de salvar
        if (userType === 'cliente' && userId) {
          setShowSaveDialog(true);
        }
      } else {
        setError(response.error || 'Erro no processamento');
      }
    } catch (error: any) {
      setError(`Erro inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedFile, userType, userId]);

  const handleSaveSimulation = useCallback(async (salaoId: string) => {
    if (!results || !userId) {
      setError('Dados insuficientes para salvar');
      return false;
    }

    const success = await saveSimulation(userId, salaoId, results);
    
    if (success) {
      setShowSaveDialog(false);
      // Opcional: mostrar mensagem de sucesso
    }
    
    return success;
  }, [results, userId, saveSimulation]);

  const handleImageClick = useCallback((imageUrl: string) => {
    setModalImage(imageUrl);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalImage(null);
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const changeFile = useCallback(() => {
    setResults(null);
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    setShowSaveDialog(false);
    clearSaveStatus();
    openFileDialog();
  }, [openFileDialog, clearSaveStatus]);

  const closeSaveDialog = useCallback(() => {
    setShowSaveDialog(false);
    clearSaveStatus();
  }, [clearSaveStatus]);

  return {
    preview,
    results,
    loading,
    error: error || saveError,
    modalOpen,
    modalImage,
    showSaveDialog,
    saveLoading,
    saveSuccess,
    fileInputRef,
    handleFileSelect,
    processImage,
    handleImageClick,
    closeModal,
    openFileDialog,
    changeFile,
    handleSaveSimulation,
    closeSaveDialog,
  };
};