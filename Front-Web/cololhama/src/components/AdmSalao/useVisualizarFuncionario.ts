import { useState, useEffect } from "react";
import { Funcionario } from "../../models/funcionarioModel";
import FuncionarioService from "../../services/FuncionarioService";
import { useNavigate } from "react-router-dom";

interface UseVisualizarFuncionariosResult {
  funcionarios: Funcionario[];
  totalFuncionarios: number;
  isLoading: boolean;
  error: string | null;
  handleEditarFuncionario: (funcionarioId: string) => void;
}

export const useVisualizarFuncionarios = (
  page: number = 1,
  limit: number = 10,
  nomeFilter: string = "",
  salaoId: string
): UseVisualizarFuncionariosResult => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [totalFuncionarios, setTotalFuncionarios] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const buscarFuncionarios = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await FuncionarioService.getFuncionarioPage(
          page,
          limit,
          nomeFilter,
          false,
          salaoId
        );
        const listaFuncionarios: Funcionario[] = (response.data || []).map(
          (item: any) => ({
            ID: item.ID ?? "",
            CPF: item.CPF ?? "",
            Nome: item.Nome ?? "",
            Email: item.Email ?? "",
            Telefone: item.Telefone ?? "",
            SalaoId: item.SalaoId ?? "",
            Auxiliar: item.Auxiliar ?? false,
            DataCadastro: item.DataCadastro ?? "",
          })
        );
        setFuncionarios(listaFuncionarios);
        setTotalFuncionarios(response.total);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar funcionários"
        );
        console.error("Erro ao buscar funcionários:", err);
      } finally {
        setIsLoading(false);
      }
    };

    buscarFuncionarios();
  }, [page, limit, nomeFilter, salaoId]);

  const handleEditarFuncionario = (funcionarioId: string) => {
    navigate(`/funcionario/editar/${funcionarioId}`);
  };

  return {
    funcionarios,
    totalFuncionarios,
    isLoading,
    error,
    handleEditarFuncionario,
  };
};
