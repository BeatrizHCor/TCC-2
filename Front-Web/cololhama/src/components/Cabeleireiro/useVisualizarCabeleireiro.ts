import { useState, useEffect } from "react";
import { Cabeleireiro } from "../../models/cabelereiroModel";
import CabeleireiroService from "../../services/CabeleireiroService";

export const useVisualizarCabeleireiros = (
  page: number = 1,
  limit: number = 10,
  salaoId: string
) => {
  const [cabeleireiros, setCabeleireiros] = useState<Cabeleireiro[]>([]);
  const [totalCabeleireiros, setTotalCabeleireiros] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscarCabeleireiros = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await CabeleireiroService.getCabeleireiroPage(
          page,
          limit,
          false,
          salaoId
        );

        setCabeleireiros(response.data);
        setTotalCabeleireiros(response.total);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar cabeleireiros"
        );
        console.error("Erro ao buscar cabeleireiros:", err);
      } finally {
        setIsLoading(false);
      }
    };

    buscarCabeleireiros();
  }, [page, limit, salaoId]);

  return {
    cabeleireiros,
    totalCabeleireiros,
    isLoading,
    error,
  };
};
