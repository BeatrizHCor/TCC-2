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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
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
  { id: "email", label: "Email" },
  { id: "telefone", label: "Telefone" },
  { id: "mei", label: "MEI" },
  { id: "portif", label: "Portifólio" },
  { id: "acoes", label: "Ações" },
];

interface VisualizarCabeleireiroProps {
  isCliente?: boolean;
}

export const VisualizarCabeleireiro: React.FC<
  VisualizarCabeleireiroProps
> = ({}) => {
  const { userType } = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    setTermoBusca(NomeFiltroInput);
    setPage(0);
  };

  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar cabeleireiro: {error}</Box>;

  const colunasVisiveis =
    !userType || userType !== userTypes.CLIENTE
      ? colunas.filter((coluna) => coluna.id !== "acoes")
      : colunas;

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Cabelereiros
      </Typography>
      <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
        <TextField
          variant="outlined"
          label="Buscar por nome"
          value={NomeFiltroInput}
          onChange={handleNomeFilterInput}
          sx={{ maxWidth: "50%", flexGrow: 1 }}
        />
        <Button variant="contained" onClick={aplicarFiltroNome}>
          Buscar
        </Button>
        {userType && userType !== userTypes.CLIENTE ? (
          <Button
            component={Link}
            variant="outlined"
            to="/cabeleireiro/novo"
            sx={{
              color: theme.palette.primary.main,
              borderBlockColor: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderWidth: 1,
            }}
          >
            Novo Cabelereiro
          </Button>
        ) : null}
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {colunasVisiveis.map((coluna) => (
                  <TableCell key={coluna.id}>{coluna.label}</TableCell>
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
                  <TableRow key={cabeleireiro.ID}>
                    <TableCell>{cabeleireiro.Nome}</TableCell>
                    <TableCell>{cabeleireiro.Email}</TableCell>
                    <TableCell>{cabeleireiro.Telefone}</TableCell>
                    <TableCell>{cabeleireiro.Mei}</TableCell>
                    <TableCell>
                      <Button
                        startIcon={<Image />}
                        variant="outlined"
                        size="small"
                      >
                        Portifólio
                      </Button>
                    </TableCell>
                    {userType &&
                    userType !== userTypes.CLIENTE &&
                    userType !== userTypes.CABELEIREIRO ? (
                      <TableCell>
                        <Button
                          startIcon={<EditIcon />}
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            cabeleireiro.ID &&
                              handleEditarCabeleireiro(cabeleireiro.ID);
                          }}
                        >
                          Editar
                        </Button>
                      </TableCell>
                    ) : null}
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
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </Paper>
    </Box>
  );
};
export default VisualizarCabeleireiro;
