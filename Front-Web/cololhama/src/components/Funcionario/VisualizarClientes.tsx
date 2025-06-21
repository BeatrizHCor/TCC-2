import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Cliente } from "../../models/clienteModel";
import { useVisualizarClientes } from "./useVisualizarClientes";
import { AuthContext } from "../../contexts/AuthContext";
import theme from "../../styles/theme";

const salaoId = import.meta.env.VITE_SALAO_ID || "1";

const colunas = [
  { id: "Nome", label: "Nome" },
  { id: "Email", label: "Email" },
  { id: "Telefone", label: "Telefone" },
  { id: "DataCadastro", label: "Data de Cadastro" },
];

const colunasSelecionadas = colunas.filter((col) => col.id !== "DataCadastro");

const meses = Array.from({ length: 12 }, (_, i) => ({
  valor: (i + 1).toString(),
  nome: new Date(0, i)
    .toLocaleString("pt-BR", { month: "long" })
    .replace(/^\w/, (c) => c.toUpperCase()),
}));

export const VisualizarClientes: React.FC = () => {
  const { doLogout } = useContext(AuthContext);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [colunaBusca, setColunaBusca] = useState("Nome");
  const [termoBusca, setTermoBusca] = useState("");
  const [anoFilter, setAnoFilter] = useState("");
  const [mesFilter, setMesFilter] = useState("");
  const [diaFilter, setDiaFilter] = useState("");
  const [dataFilter, setDataFilter] = useState("");
  const [termoFiltroInput, setTermoFiltroInput] = useState("");

  const { clientes, totalClientes, isLoading, error, forbidden } =
    useVisualizarClientes(
      page + 1,
      rowsPerPage,
      salaoId,
      termoBusca,
      colunaBusca,
      dataFilter
    );

  useEffect(() => {
    if (forbidden) doLogout();
  }, [forbidden]);

  const limparFiltrosData = () => {
    setAnoFilter("");
    setMesFilter("");
    setDiaFilter("");
    setDataFilter("");
  };

  const gerarAnos = () => {
    const anoAtual = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => (anoAtual - 5 + i).toString());
  };

  const gerarDias = () => Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const construirFiltroData = () => {
    let filtroData = "";
    if (anoFilter) {
      filtroData = anoFilter;
      if (mesFilter) {
        filtroData += `-${mesFilter.padStart(2, "0")}`;
        if (diaFilter) {
          filtroData += `-${diaFilter.padStart(2, "0")}`;
        }
      }
    }
    return filtroData;
  };

  const aplicarFiltro = () => {
    setDataFilter(construirFiltroData());
    setTermoBusca(termoFiltroInput);
    setPage(0);
  };

  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar clientes: {error}</Box>;

  return (
    <Box sx={{ width: "100%", px: { xs: 1, sm: 3 }, py: 2 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}
      >
        Clientes Cadastrados
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          mb: 2,
          width: "100%",
          maxWidth: "900px",
          mx: "auto",
        }}
      >
        <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="coluna-busca-label">Buscar por</InputLabel>
          <Select
            labelId="coluna-busca-label"
            value={colunaBusca}
            onChange={(e) => {
              setColunaBusca(e.target.value);
              limparFiltrosData();
            }}
            label="Buscar por"
          >
            {colunasSelecionadas.map((coluna) => (
              <MenuItem key={coluna.id} value={coluna.id}>
                {coluna.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          label="Buscar"
          value={termoFiltroInput}
          onChange={(e) => setTermoFiltroInput(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, minWidth: 200, maxWidth: 320 }}
        />

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Ano</InputLabel>
          <Select value={anoFilter} label="Ano" onChange={(e) => setAnoFilter(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            {gerarAnos().map((ano) => (
              <MenuItem key={ano} value={ano}>
                {ano}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Mês</InputLabel>
          <Select
            value={mesFilter}
            label="Mês"
            onChange={(e) => setMesFilter(e.target.value)}
            disabled={!anoFilter}
          >
            <MenuItem value="">Todos</MenuItem>
            {meses.map((mes) => (
              <MenuItem key={mes.valor} value={mes.valor}>
                {mes.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Dia</InputLabel>
          <Select
            value={diaFilter}
            label="Dia"
            onChange={(e) => setDiaFilter(e.target.value)}
            disabled={!mesFilter}
          >
            <MenuItem value="">Todos</MenuItem>
            {gerarDias().map((dia) => (
              <MenuItem key={dia} value={dia}>
                {dia}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={aplicarFiltro}
          size="medium"
          sx={{ minWidth: 110, height: 40 }}
        >
          Buscar
        </Button>
      </Box>

      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                {colunas.map((coluna) => (
                  <TableCell
                    key={coluna.id}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      fontSize: "0.875rem",
                      color: "#fff",
                    }}
                  >
                    {coluna.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {clientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colunas.length} align="center">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((cliente: Cliente) => (
                  <TableRow
                    key={cliente.ID}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    <TableCell>{cliente.Nome || "—"}</TableCell>
                    <TableCell>{cliente.Email || "—"}</TableCell>
                    <TableCell>{cliente.Telefone || "—"}</TableCell>
                    <TableCell>
                      {cliente.DataCadastro
                        ? new Date(cliente.DataCadastro).toLocaleDateString("pt-BR")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalClientes}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
          sx={{ backgroundColor: "#fff", mt: 1.5 }}
        />
      </Paper>
    </Box>
  );
};

export default VisualizarClientes;