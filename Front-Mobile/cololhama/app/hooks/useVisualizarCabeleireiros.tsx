import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import CabeleireiroService from "../services/CabeleireiroService";
import { Cabeleireiro } from "../models/cabeleireiroModel";

export const useVisualizarCabeleireiros = (
  page: number,
  limit: number,
  salaoId: string,
  nomeFilter: string
) => {
  const [cabeleireiros, setCabeleireiro] = useState<Cabeleireiro[]>([]);
  const [totalCabeleireiro, setTotalCabeleireiro] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCabeleireiro = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await CabeleireiroService.getCabeleireiroPaginados(
          page,
          limit,
          salaoId,
          nomeFilter || undefined
        );
        console.log("idSalao,", salaoId);
        console.log(" retornados:", response.data); // Verificando dados recebidos

        setCabeleireiro(response.data);
        setTotalCabeleireiro(response.total);
      } catch (err) {
        console.error("Erro ao buscar :", err);
        setError("Falha ao carregar . Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCabeleireiro();
  }, [page, limit, salaoId, nomeFilter]);

  const handleEditarCabeleireiro = (id: string) => {
    //router.push(`/VisualizarCabeleireiroScreen/editar/${id}`);
  };

  return {
    cabeleireiros,
    totalCabeleireiro,
    isLoading,
    error,
    handleEditarCabeleireiro,
  };
};
