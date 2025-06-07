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
import { Servico } from "../../models/servicoModel";
import { useVisualizarServicos } from "./useVisualizarServicos";
import "../../styles/styles.global.css";
import { Link } from "react-router-dom";
import theme from "../../styles/theme";
import { AuthContext } from "../../contexts/AuthContext";
import { userTypes } from "../../models/tipo-usuario.enum";

const SalaoID = import.meta.env.VITE_SALAO_ID || "1";
const colunas = [
  { id: "nome", label: "Nome" },
  { id: "descricao", label: "Descrição" },
  { id: "precoMin", label: "Preço Mínimo" },
  { id: "precoMax", label: "Preço Máximo" },
  { id: "acoes", label: "Ações", clienteVisivel: false },
];

interface VisualizarServicosProps {
  isCliente?: boolean;
}

export const VisualizarServicos: React.FC<VisualizarServicosProps> = ({
  isCliente: canEdit = false,
}) => {
  const { userType } = useContext(AuthContext);
  canEdit = !!(
    userType &&
    [
      userTypes.Funcionario,
      userTypes.AdmSalao,
      userTypes.AdmSistema,
    ].includes(userType)
  );
  const salaoId = import.meta.env.VITE_SALAO_ID;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [nomeFilter, setNomeFilter] = useState("");
  const [precoMinFilter, setPrecoMinFilter] = useState<number | "">("");
  const [precoMaxFilter, setPrecoMaxFilter] = useState<number | "">("");

  const { servicos, totalServicos, isLoading, error, handleEditarServico } =
    useVisualizarServicos(
      page + 1,
      rowsPerPage,
      salaoId,
      nomeFilter,
      precoMinFilter,
      precoMaxFilter
    );

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

  const [precoMaxInput, setPrecoMaxInput] = useState<Number | "">("");
  const handlePrecoMaxInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    setPrecoMaxInput(onlyNumbers === "" ? "" : Number(onlyNumbers));
  };
  const aplicarFiltroPrecoMax = () => {
    setPrecoMaxFilter(Number(precoMaxInput));
    setPage(0);
  };

  const [precoMinInput, setPrecoMinInput] = useState<Number | "">("");
  const handlePrecoMinInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    setPrecoMinInput(onlyNumbers === "" ? "" : Number(onlyNumbers));
  };
  const aplicarFiltroPreco = () => {
    setPrecoMinFilter(Number(precoMinInput));
    setPage(0);
  };

  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar serviços: {error}</Box>;

  const colunasVisiveis = canEdit
    ? colunas
    : colunas.filter((coluna) => coluna.clienteVisivel !== false);

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Serviços do Salão
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          mb: 2,
          gap: { xs: 2, sm: 2 },
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          variant="outlined"
          label="Buscar por nome"
          value={NomeFiltroInput}
          onChange={handleNomeFilterInput}
          sx={{
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: "40%" },
            maxWidth: { sm: "50%" }
          }}     
        />
        <Button
          variant="contained"
          onClick={aplicarFiltroNome}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Buscar
        </Button>
        {canEdit && (
          <Button
            component={Link}
            variant="outlined"
            to="/servico/editar/novo"
            sx={{
              color: theme.palette.primary.main,
              borderBlockColor: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderWidth: 1,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Novo Serviço
          </Button>
        )}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <TextField
            variant="outlined"
            label="Preço mínimo"
            type="text"
            value={precoMinInput}
            onChange={handlePrecoMinInputChange}
            sx={{ width: { xs: "100%", sm: "150px" } }}
            inputMode="numeric"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={aplicarFiltroPreco}>
                      <CheckIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            variant="outlined"
            label="Preço máximo"
            type="text"
            value={precoMaxInput}
            onChange={handlePrecoMaxInputChange}
            sx={{ width: { xs: "100%", sm: "150px" } }}
            inputMode="numeric"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={aplicarFiltroPrecoMax}>
                      <CheckIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow key="header-row">
                {colunasVisiveis.map((coluna) => (
                  <TableCell key={coluna.id}>{coluna.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {servicos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colunasVisiveis.length} align="center">
                    Nenhum serviço encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                servicos.map((servicos: Servico, index) => (
                  <TableRow key={servicos.ID ?? `row-${index}`}>
                    <TableCell>{servicos.Nome || "—"} </TableCell>
                    <TableCell>{servicos.Descricao || "—"}</TableCell>
                    <TableCell>
                      R${" "}
                      {servicos.PrecoMin !== undefined
                        ? servicos.PrecoMin.toFixed(2)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      R${" "}
                      {servicos.PrecoMax !== undefined
                        ? servicos.PrecoMax.toFixed(2)
                        : "N/A"}
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <Button
                          startIcon={<EditIcon />}
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            servicos.ID && handleEditarServico(servicos.ID)
                          }
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
          count={totalServicos}
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

export default VisualizarServicos;
