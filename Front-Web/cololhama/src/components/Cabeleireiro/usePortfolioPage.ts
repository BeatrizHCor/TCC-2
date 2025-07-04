import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import PortfolioService from "../../services/PortfolioService";

interface Imagem {
  Descricao: string;
  ID: string;
  PortfolioId: string;
  fileContent: string;
  fileSize: number;
}

export const usePortfolio = (cabeleireiroId: string | undefined) => {
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [nomeCabeleireiro, setNomeCabeleireiro] = useState<string | null>(null);
  const [DescricaoPort, setDescricaoPort] = useState<string | null>(null);

  const fetchImagens = useCallback(async () => {
    if (!cabeleireiroId) {
      setImagens([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await PortfolioService.getPortfolioByCabeleireiroId(
        cabeleireiroId,
      );
      console.log("Resposta do servidor:", response);
      let PortFotos = response.imagens || [];
      if (response) {
        setImagens(
          PortFotos.map((img: any) => ({
            Descricao: img.Descricao || "",
            ID: img.ID || "",
            PortfolioId: img.PortfolioId || "",
            fileContent: img.fileContent || "",
            fileSize: img.fileSize || 0,
          })),
        );
        setPortfolioId(response.ID || null);
        setNomeCabeleireiro(response.Cabeleireiro || null);
        setDescricaoPort(response.Descricao || null);
      } else {
        setImagens([]);
        setPortfolioId(null);
      }
    } catch (err) {
      console.error("Erro ao carregar imagens:", err);
      setError("Não foi possível carregar as imagens. Tente novamente.");
      setImagens([]);
    } finally {
      setLoading(false);
    }
  }, [cabeleireiroId]);

  const uploadImagem = async (file: File, descricao: string) => {
    if (!cabeleireiroId) {
      throw new Error("ID do portfólio não disponível");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await PortfolioService.uploadImagemPortfolio(
        file,
        portfolioId!,
        descricao,
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
          `Erro ao fazer upload: ${err.response?.data?.message || err.message}`,
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

  const deleteImagem = async (imagemId: string) => {
    if (!imagemId) {
      throw new Error("ID da imagem não disponível");
    }

    setLoading(true);
    setError(null);

    try {
      await PortfolioService.deleteImagemPortfolio(portfolioId!, imagemId);
      await fetchImagens();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Erro ao deletar:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setError(
          `Erro ao excluir imagem: ${
            err.response?.data?.message || err.message
          }`,
        );
      } else {
        console.error("Erro desconhecido:", err);
        setError("Erro desconhecido ao excluir imagem");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDescricaoPortfolio = async (novaDescricao: string) => {
    if (!portfolioId) {
      throw new Error("ID do portfólio não disponível");
    }

    setLoading(true);
    setError(null);

    try {
      await PortfolioService.atualizarPortfolio(portfolioId, 
        novaDescricao
      );
      await fetchImagens();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Erro ao atualizar descrição:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setError(
          `Erro ao atualizar descrição: ${
            err.response?.data?.message || err.message
          }`,
        );
      } else {
        console.error("Erro desconhecido:", err);
        setError("Erro desconhecido ao atualizar descrição");
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
    deleteImagem,
    updateDescricaoPortfolio,
    portfolioId,
    nomeCabeleireiro,
    DescricaoPort,
  };
};