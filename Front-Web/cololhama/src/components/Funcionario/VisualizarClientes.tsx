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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { Cliente } from "../../models/clienteModel";
import { useVisualizarClientes } from "./useVisualizarClientes";
import "../../styles/styles.global.css";
import { AuthContext } from "../../contexts/AuthContext";
const salaoId = import.meta.env.VITE_SALAO_ID || "1";
const colunas = [
  { id: "Nome", label: "Nome" },
  { id: "Email", label: "Email" },
  { id: "Telefone", label: "Telefone" },
  { id: "DataCadastro", label: "Data de Cadastro" },
];
const colunasSelecionadas = colunas.filter(col => col.id !== "DataCadastro");
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
  
  const { clientes, totalClientes, isLoading, error, forbidden } =
    useVisualizarClientes(page + 1, rowsPerPage, salaoId, termoBusca, colunaBusca, dataFilter,);
  useEffect(() => {
    if (forbidden) {
      doLogout();
    }
  }, [forbidden]);

  const limparFiltrosData = () => {
    setAnoFilter("");
    setMesFilter("");
    setDiaFilter("");
    setDataFilter("");
  };
  const gerarAnos = () => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    for (let i = anoAtual - 5; i <= anoAtual + 2; i++) {
      anos.push(i);
    }
    return anos;
  };

  const meses = [
    { valor: 1, nome: "Janeiro" },
    { valor: 2, nome: "Fevereiro" },
    { valor: 3, nome: "Março" },
    { valor: 4, nome: "Abril" },
    { valor: 5, nome: "Maio" },
    { valor: 6, nome: "Junho" },
    { valor: 7, nome: "Julho" },
    { valor: 8, nome: "Agosto" },
    { valor: 9, nome: "Setembro" },
    { valor: 10, nome: "Outubro" },
    { valor: 11, nome: "Novembro" },
    { valor: 12, nome: "Dezembro" },
  ];

    const gerarDias = () => {
    const dias = [];
    for (let i = 1; i <= 31; i++) {
      dias.push(i);
    }
    return dias;
  };

  const construirFiltroData = () => {
    let filtroData = "";
    if (anoFilter) {
      filtroData = anoFilter;
      if (mesFilter) {
        filtroData += `-${String(mesFilter).padStart(2, '0')}`;
        if (diaFilter) {
          filtroData += `-${String(diaFilter).padStart(2, '0')}`;
        }
      }
    }
    return filtroData;
  };
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleColunaBuscaChange = (event: any) => {
    setColunaBusca(event.target.value);
    limparFiltrosData();
  };

  const [termoFiltroInput, setTermoFiltroInput] = useState("");
  const handleTermoFiltroInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermoFiltroInput(e.target.value);
  };
  const aplicarFiltro = () => {
    setDataFilter(construirFiltroData());
    console.log("datamontada: ", dataFilter);
    setTermoBusca(termoFiltroInput);
    setPage(0);
  };
  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar clientes: {error}</Box>;

  return (
    <Box sx={{ width: "100%", p: { xs: 1, sm: 2 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          mb: 2,
          gap: 2,
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <FormControl
          variant="outlined"
          sx={{
            minWidth: { xs: "100%", sm: 120 },
            mr: { xs: 0, sm: 1 },
          }}
        >
          <InputLabel id="coluna-busca-label">Buscar por</InputLabel>
          <Select
            labelId="coluna-busca-label"
            value={colunaBusca}
            onChange={handleColunaBuscaChange}
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
          onChange={handleTermoFiltroInput}
          sx={{
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: "200px" },
            maxWidth: { sm: "40%" },
            flexGrow: 1,
          }}
        />
        <FormControl fullWidth size="small"
        sx={{
          width: { xs: "100%", sm: "auto" },
          minWidth: { sm: 100 },
          maxWidth: { sm: 120 },
          flex: { xs: "1 1 100%", sm: "0 1 auto" },
        }}>
          <InputLabel>Ano</InputLabel>
          <Select
            value={anoFilter}
            label="Ano"
            onChange={(e) => setAnoFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {gerarAnos().map((ano) => (
              <MenuItem key={ano} value={ano}>
                {ano}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small" 
        sx={{
          width: { xs: "100%", sm: "auto" },
          minWidth: { sm: 100 },
          maxWidth: { sm: 120 },
          flex: { xs: "1 1 100%", sm: "0 1 auto" },
        }}>
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
        <FormControl fullWidth size="small"         
        sx={{
          width: { xs: "100%", sm: "auto" },
          minWidth: { sm: 100 },
          maxWidth: { sm: 120 },
          flex: { xs: "1 1 100%", sm: "0 1 auto" },
        }}>
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
          sx={{
            width: { xs: "100%", sm: "auto" },
            mt: { xs: 1, sm: 0 },
          }}
        >
          Buscar
        </Button>
      </Box>

      <Paper sx={{ width: "100%", mb: 2, overflowX: "auto" }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {colunas.map((coluna) => (
                  <TableCell key={coluna.id}>{coluna.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente: Cliente) => (
                <TableRow key={cliente.ID}>
                  <TableCell>{cliente.Nome}</TableCell>
                  <TableCell>{cliente.Email}</TableCell>
                  <TableCell>{cliente.Telefone}</TableCell>
                  <TableCell>
                    {cliente.DataCadastro
                      ? new Date(cliente.DataCadastro).toLocaleDateString("pt-BR")
                      : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalClientes}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </Paper>
    </Box>
  );

};
export default VisualizarClientes;