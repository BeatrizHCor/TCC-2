import React, { useContext, useState } from "react";
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { Image } from "@mui/icons-material";
import { useVisualizarCabeleireiros } from "./useVisualizarCabeleireiro";
import "../../styles/styles.global.css";
import { Cabeleireiro } from "../../models/cabelereiroModel";
import { Link } from "react-router-dom";
import theme from "../../styles/theme";
import { AuthContext } from "../../contexts/AuthContext";
import { userTypes } from "../../models/tipo-usuario.enum";

const SalaoID = import.meta.env.VITE_SALAO_ID || "1";

const colunas = [
  { id: "nome", label: "Nome", clienteVisivel: true, cabeleireiroVisivel: true },
  { id: "email", label: "Email", clienteVisivel: false, cabeleireiroVisivel: true },
  { id: "telefone", label: "Telefone", clienteVisivel: false, cabeleireiroVisivel: true },
  { id: "mei", label: "MEI", clienteVisivel: false, cabeleireiroVisivel: true },
  { id: "portif", label: "Portfólio", clienteVisivel: true, cabeleireiroVisivel: true },
  { id: "acoes", label: "Ações", clienteVisivel: false, cabeleireiroVisivel: false },
];

export const VisualizarCabeleireiro: React.FC = () => {
  const { userType } = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [nomeFilterInput, setNomeFilterInput] = useState("");
  const [termoBusca, setTermoBusca] = useState("");

  const {
    cabeleireiros,
    totalCabeleireiros,
    handleEditarCabeleireiro,
    isLoading,
    error,
  } = useVisualizarCabeleireiros(page + 1, rowsPerPage, SalaoID, termoBusca);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const aplicarFiltroNome = () => {
    setTermoBusca(nomeFilterInput);
    setPage(0);
  };

  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar cabeleireiros: {error}</Box>;

  const canEdit =
    userType &&
    [userTypes.Funcionario, userTypes.AdmSalao, userTypes.AdmSistema].includes(userType);

  const colunasVisiveis =
    userType === userTypes.Cliente
      ? colunas.filter((c) => c.clienteVisivel !== false)
      : userType === userTypes.Cabeleireiro
      ? colunas.filter((c) => c.cabeleireiroVisivel !== false)
      : colunas;

  return (
    <Box sx={{ width: "100%", px: { xs: 1, sm: 3 }, py: 2 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}
      >
        Cabeleireiros
      </Typography>

      <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
    mb: 3,
    maxWidth: 700,
    mx: "auto",
  }}
>
  <TextField
    variant="outlined"
    label="Buscar por nome"
    value={nomeFilterInput}
    onChange={(e) => setNomeFilterInput(e.target.value)}
    size="medium"
    sx={{ flexGrow: 1, minWidth: 280 }}
  />
  <Button
    variant="contained"
    onClick={aplicarFiltroNome}
    size="medium"
    sx={{ height: 45, minWidth: 120 }}
  >
    Buscar
  </Button>

  {canEdit && (
    <Button
      component={Link}
      to="/cabeleireiro/novo"
      variant="contained"
      size="medium"
      sx={{
        backgroundColor: "#f5f5f5",
        color: theme.palette.primary.main,
        border: `1.5px solid ${theme.palette.primary.main}`,
        height: 45,
        minWidth: 140,
        "&:hover": {
          backgroundColor: "#e0e0e0",
          borderColor: theme.palette.primary.main,
        },
        textTransform: "none",
        fontWeight: 600,
        boxShadow: "none",
      }}
    >
      Novo Cabeleireiro
    </Button>
  )}
</Box>


      {/* Tabela */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid #ccc" }}
              >
                {colunasVisiveis.map((coluna) => (
                  <TableCell
                    key={coluna.id}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      fontSize: "0.875rem",
                    }}
                  >
                    {coluna.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {cabeleireiros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colunasVisiveis.length} align="center">
                    Nenhum cabeleireiro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                cabeleireiros.map((cabeleireiro: Cabeleireiro) => (
                  <TableRow
                    key={cabeleireiro.ID}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
                  >
                    <TableCell>{cabeleireiro.Nome || "—"}</TableCell>

                    {userType !== userTypes.Cliente && (
                      <>
                        <TableCell>{cabeleireiro.Email || "Indisponível"}</TableCell>
                        <TableCell>{cabeleireiro.Telefone || "Indisponível"}</TableCell>
                        <TableCell>
                          {cabeleireiro.Mei === undefined
                            ? "Não informado"
                            : cabeleireiro.Mei || "Indisponível"}
                        </TableCell>
                      </>
                    )}

                    <TableCell>
                      <Button
                        component={Link}
                        startIcon={<Image />}
                        variant="outlined"
                        size="small"
                        to={`/portfolio/${cabeleireiro.ID}`}
                      >
                        Portfólio
                      </Button>
                    </TableCell>

                    {canEdit && (
                      <TableCell>
                        <Button
                          startIcon={<EditIcon />}
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            if (cabeleireiro.ID) handleEditarCabeleireiro(cabeleireiro.ID);
                          }}
                        >
                          Editar
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCabeleireiros}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
    </Box>
  );
};

export default VisualizarCabeleireiro;
