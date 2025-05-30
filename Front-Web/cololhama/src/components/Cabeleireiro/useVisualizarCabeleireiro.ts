import { useState, useEffect } from "react";
import { Cabeleireiro } from "../../models/cabelereiroModel";
import CabeleireiroService from "../../services/CabeleireiroService";
import { useNavigate } from "react-router-dom";

interface UseVisualizarCabeleireirosResult {
  cabeleireiros: Cabeleireiro[];
  totalCabeleireiros: number;
  isLoading: boolean;
  error: string | null;
  handleEditarCabeleireiro: (cabeleireiroId: string) => void;
}

export const useVisualizarCabeleireiros = (
  page: number = 1,
  limit: number = 10,
  salaoId: string,
  termoBusca: string
): UseVisualizarCabeleireirosResult => {
  const [cabeleireiros, setCabeleireiros] = useState<Cabeleireiro[]>([]);
  const [totalCabeleireiros, setTotalCabeleireiros] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const buscarCabeleireiros = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await CabeleireiroService.getCabeleireiroPage(
          page,
          limit,
          false,
          salaoId,
          termoBusca
        );
        const listaCabeleireiros: Cabeleireiro[] = (response.data || []).map(
          (item: any) => ({
            ID: item?.ID ?? "",
            CPF: item?.CPF ?? "",
            Nome: item?.Nome ?? "",
            Email: item?.Email ?? "",
            Telefone: item?.Telefone ?? "",
            MEI: item?.Mei ?? "",
            SalaoId: item?.SalaoId ?? "",
          })
        );
        setCabeleireiros(listaCabeleireiros);
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
  }, [page, limit, salaoId, termoBusca]);
    const handleEditarCabeleireiro = (cabeleireiroId: string) => {
    navigate(`/cabeleireiro/editar/${cabeleireiroId}`);
  }

  return {
    handleEditarCabeleireiro,
    cabeleireiros,
    totalCabeleireiros,
    isLoading,
    error,
  };
};
