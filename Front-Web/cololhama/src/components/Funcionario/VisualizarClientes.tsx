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

export const VisualizarClientes: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [colunaBusca, setColunaBusca] = useState("Nome");
  const [termoBusca, setTermoBusca] = useState("");
  const { doLogout } = useContext(AuthContext);
  const { clientes, totalClientes, isLoading, error, forbidden } =
  useVisualizarClientes(page + 1, rowsPerPage, salaoId, termoBusca, colunaBusca);
  useEffect(() => {
    if (forbidden) {
      doLogout();
    }
  }, [forbidden]);
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
  };

  const [termoFiltroInput, setTermoFiltroInput] = useState("");
  const handleTermoFiltroInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermoFiltroInput(e.target.value);
  };
  const aplicarFiltro = () => {
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
          {colunas.map((coluna) => (
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
