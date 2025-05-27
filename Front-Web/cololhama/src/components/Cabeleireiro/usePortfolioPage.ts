import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PortfolioService from "../../services/PortfolioService";

interface Imagem {
  Descricao: string;
  Endereco: string;
  HistoricoSimulacaoId: string | null;
  ID: string;
  PortfolioId: string;
  fileContent: string;
  fileSize: number;
}

export const usePortfolio = (portfolioId: string | undefined) => {
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const IMAGEM_URL = import.meta.env.VITE_IMAGEM_URL;

  const fetchImagens = useCallback(async () => {
    if (!portfolioId) {
      setImagens([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("ID do portfólio:", portfolioId);
      const response = await PortfolioService.getImagensByPortfolio(
        portfolioId
      );
      console.log("Resposta do servidor:", response);
      const data = Array.isArray(response) ? response : [response];
      setImagens(
        data.map((item: any) => ({
          Descricao: item.Descricao || "",
          Endereco: item.Endereco || "",
          HistoricoSimulacaoId: item.HistoricoSimulacaoId || null,
          ID: item.ID || "",
          PortfolioId: item.PortfolioId || "",
          fileContent: item.fileContent || "",
          fileSize: item.fileSize || 0,
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar imagens:", err);
      setError("Não foi possível carregar as imagens. Tente novamente.");
      setImagens([]);
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);

  const uploadImagem = async (file: File, descricao: string) => {
    if (!portfolioId) {
      throw new Error("ID do portfólio não disponível");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await PortfolioService.uploadImagemPortfolio(
        file,
        portfolioId,
        descricao
      );

      await fetchImagens();
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Erro de upload:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setError(
          `Erro ao fazer upload: ${err.response?.data?.message || err.message}`
        );
      } else {
        console.error("Erro desconhecido:", err);
        setError("Erro desconhecido ao fazer upload");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImagens();
  }, [fetchImagens]);

  return {
    imagens,
    loading,
    error,
    fetchImagens,
    uploadImagem,
    IMAGEM_URL,
  };
};
