import { useState, useEffect } from "react";
import { Cliente } from "../../models/clienteModel";
import ClienteService from "../../services/ClienteService";

export const useVisualizarClientes = (
  page: number = 1,
  limit: number = 10,
  salaoId: string,
  termoBusca: string, 
  colunaBusca: string,
  dataFilter: string = "",
) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const buscarClientes = async () => {
        setIsLoading(true);
        setError(null);
      try {
        const response = await ClienteService.getClientePage(
          page,
          limit,
          salaoId,
          termoBusca,
          colunaBusca,
          dataFilter,
          false

        );
        if (typeof response === "boolean") {
          setForbidden(true);
        } else {
          const listaClientes: Cliente[] = (response.data || []).map(
            (item: any) => ({
              ID: item.ID ?? "",
              Nome: item.Nome ?? "",
              Email: item.Email ?? "",
              Telefone: item.Telefone ?? "",
              DataCadastro: item.DataCadastro ?? "",
              CPF: item.CPF ?? "",
              SalaoId: item.SalaoId ?? "",
            })
          );
          setClientes(listaClientes);
          setTotalClientes(response.total);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar clientes"
        );
        console.error("Erro ao buscar clientes:", err);
      } finally {
        setIsLoading(false);
      }
    };

  buscarClientes();
  }, 400);

  return () => clearTimeout(timeout);
}, [page, limit, salaoId, termoBusca, colunaBusca, dataFilter]);

  return {
    clientes,
    totalClientes,
    isLoading,
    error,
    forbidden,
  };
};
