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
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { userTypes } from "../../models/tipo-usuario.enum";
import theme from "../../styles/theme";
import "../../styles/styles.global.css";

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
  const [nomeFiltroInput, setNomeFiltroInput] = useState("");

  const isADMSalao =
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

  const handleNomeFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeFiltroInput(e.target.value);
  };

  const aplicarFiltroNome = () => {
    setNomeFilter(nomeFiltroInput);
    setPage(0);
  };

  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar funcionários: {error}</Box>;

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 4 } }}>
       <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: { xs: 'center', md: 'space-between' },
          alignItems: 'center',
          mb: 2,
        }}
        >
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 1, md: 0 },
            fontWeight: 600,
            color: theme.palette.primary.main,
            textAlign: { xs: 'center', md: 'left' },
          }}
          >
          Funcionários          
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: "80%",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
          }}
        >
          <TextField
            label="Buscar por nome"
            variant="outlined"
            value={nomeFiltroInput}
            onChange={handleNomeFilterInput}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            onClick={aplicarFiltroNome}
            size="medium"
            sx={{ height: 45, minWidth: 120 }}
          >
            Buscar
          </Button>
          {isADMSalao && (
            <Button
              component={Link}
              to="/funcionario/novo"
              variant="contained"
              size="medium"
              sx={{
                backgroundColor: "#f5f5f5",
                color: theme.palette.primary.main,
                border: `1.5px solid ${theme.palette.primary.main}`,
                height: 45,
                minWidth: 160,
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                  borderColor: theme.palette.primary.main,
                },
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
              }}
            >
              Novo Funcionário
            </Button>
          )}
        </Box>
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
                    sx={{ fontWeight: "bold", color: "#fff" }}
                  >
                    {coluna.label}
                  </TableCell>
                ))}
                {isADMSalao && (
                  <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                    Ações
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {funcionarios.map((funcionario: Funcionario) => (
                <TableRow
                  key={funcionario.ID}
                  hover
                  sx={{ backgroundColor: "#f7f7f7" }}
                >
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
          sx={{
            px: 2,
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        />
      </Paper>
    </Box>
  );
};

export default VisualizarFuncionarios;
