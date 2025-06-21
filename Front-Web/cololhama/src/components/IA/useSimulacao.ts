import { useState, useRef, ChangeEvent } from 'react';
import { IAService, ResultsType } from '../../services/IAService';

export const useSimulacao = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<ResultsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = IAService.validateFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Arquivo inválido');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResults(null);

    try {
      const previewUrl = await IAService.createPreview(file);
      setPreview(previewUrl);
    } catch (err) {
      setError('Erro ao carregar preview da imagem');
    }
  };

  const processImage = async () => {
    if (!selectedFile) {
      setError('Por favor, selecione uma imagem primeiro');
      return;
    }

    setLoading(true);
    setError(null);

    const response = await IAService.processHairColor(selectedFile);

    if (response.success && response.data) {
      setResults(response.data);
    } else {
      setError(response.error || 'Erro desconhecido ao processar imagem');
    }

    setLoading(false);
  };

  const handleImageClick = (image: string) => {
    setModalImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const changeFile = () => {
    resetForm();
    openFileDialog();
  };

  return {
    selectedFile,
    preview,
    results,
    loading,
    error,
    modalOpen,
    modalImage,
    fileInputRef,
    
    handleFileSelect,
    processImage,
    handleImageClick,
    closeModal,
    resetForm,
    openFileDialog,
    changeFile,
  };
};