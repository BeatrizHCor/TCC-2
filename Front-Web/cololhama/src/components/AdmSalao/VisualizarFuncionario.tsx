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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Funcionario } from "../../models/funcionarioModel";
import { useVisualizarFuncionarios } from "./useVisualizarFuncionario";
import "../../styles/styles.global.css";
import theme from "../../styles/theme";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { userTypes } from "../../models/tipo-usuario.enum";

const SalaoID = import.meta.env.VITE_SALAO_ID || "1"; 

const colunas = [
  { id: "nome", label: "Nome" },
  { id: "email", label: "Email" },
  { id: "telefone", label: "Telefone" },
  { id: "dataCadastro", label: "Data de Cadastro" },
];

export const VisualizarFuncionarios: React.FC = () => {
  const { userType, doLogout } = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [nomeFilter, setNomeFilter] = useState("");
  let isADMSalao =
    userType === userTypes.AdmSalao || userType === userTypes.AdmSistema;
  const {
    funcionarios,
    totalFuncionarios,
    isLoading,
    error,
    handleEditarFuncionario,
    forbidden,
  } = useVisualizarFuncionarios(page + 1, rowsPerPage, nomeFilter, SalaoID);
  
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
  const [NomeFiltroInput, setNomeFilterInput] = useState("");
  const handleNomeFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeFilterInput(e.target.value);
  };
  const aplicarFiltroNome = () => {
    setNomeFilter(NomeFiltroInput);
    setPage(0);
  };

  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar funcionários: {error}</Box>;

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Funcionários
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 2,
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          variant="outlined"
          label="Buscar por nome"
          value={NomeFiltroInput}
          onChange={handleNomeFilterInput}
          sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: 200 } }}
        />
        <Button
          variant="contained"
          onClick={aplicarFiltroNome}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Buscar
        </Button>
        {isADMSalao && (
          <Button
            component={Link}
            variant="outlined"
            to="/funcionario/novo"
            sx={{
              color: theme.palette.primary.main,
              borderBlockColor: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderWidth: 1,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Adicionar Funcionário
          </Button>
        )}
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                {colunas.map((coluna) => (
                  <TableCell key={coluna.id}>{coluna.label}</TableCell>
                ))}
                {isADMSalao && <TableCell>Ações</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {funcionarios.map((funcionario: Funcionario) => (
                <TableRow key={funcionario.ID}>
                  <TableCell>{funcionario.Nome}</TableCell>
                  <TableCell>{funcionario.Email}</TableCell>
                  <TableCell>{funcionario.Telefone}</TableCell>
                  <TableCell>
                    {funcionario.DataCadastro
                      ? new Date(funcionario.DataCadastro).toLocaleDateString(
                          "pt-BR"
                        )
                      : "N/A"}
                  </TableCell>
                  {isADMSalao && (
                    <TableCell>
                      <Button
                        startIcon={<EditIcon />}
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          funcionario.ID &&
                          handleEditarFuncionario(funcionario.ID)
                        }
                      >
                        Editar
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalFuncionarios}
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
export default VisualizarFuncionarios;