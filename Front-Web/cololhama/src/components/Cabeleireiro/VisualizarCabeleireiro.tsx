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
import CloseIcon from "@mui/icons-material/Close";
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
  { id: "nome", label: "Nome" },
  { id: "email", label: "Email", admVisivel: true },
  { id: "telefone", label: "Telefone", admVisivel: true },
  { id: "mei", label: "MEI", admVisivel: true },
  { id: "portif", label: "Portfólio" },
  { id: "status", label: "Status", admVisivel: true },
  { id: "acoes", label: "Ações", admVisivel: true },
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
} = useVisualizarCabeleireiros(page + 1, rowsPerPage, SalaoID, termoBusca, userType!);

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

  const admUsers = [
    userTypes.Funcionario,
    userTypes.AdmSalao,
    userTypes.AdmSistema,
  ];

  const colunasVisiveis = colunas.filter((coluna) => {
    if (!coluna.admVisivel) return true;
    return admUsers.includes(userType!);
  });


  return (
    <Box sx={{ width: "100%", px: { xs: 1, sm: 3 }, py: 2 }}>
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
          Cabeleireiros
        </Typography>
      </Box>
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

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer sx={{ backgroundColor: "#f0f0f0" }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{ backgroundColor: theme.palette.primary.main, borderBottom: "2px solid #ccc" }}
              >
                {colunasVisiveis.map((coluna) => (
                  <TableCell
                    align="center"
                    key={coluna.id}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      fontSize: "0.875rem",
                      color: "white",
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
                    <TableCell align="center">{cabeleireiro.Nome || "—"}</TableCell>

                    {admUsers.includes(userType!) && (
                      <>
                        <TableCell align="center">{cabeleireiro.Email || "Indisponível"}</TableCell>
                        <TableCell align="center">{cabeleireiro.Telefone || "Indisponível"}</TableCell>
                        <TableCell align="center">
                          {cabeleireiro.Mei === undefined
                            ? "Não informado"
                            : cabeleireiro.Mei || "Indisponível"}
                        </TableCell>
                      </>
                    )}

                    <TableCell align="center">
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
                    <TableCell align="center">
                      {cabeleireiro.Status === "ATIVO" ? (
                        <CheckIcon sx={{ color: "green" }} />
                      ) : (
                        <CloseIcon sx={{ color: "red" }} />
                      )}
                    </TableCell>
                    {canEdit && (
                      <TableCell align="center">
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
