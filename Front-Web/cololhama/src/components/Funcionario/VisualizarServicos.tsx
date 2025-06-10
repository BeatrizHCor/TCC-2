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
  <Box sx={{ width: "100%", px: { xs: 1, sm: 3 }, py: 2 }}>
    <Typography
      variant="h5"
      sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}
    >
      Serviços do Salão
    </Typography>

    {/* Filtros - linha 1 */}
<Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "center",
    mb: 2,
    width: "100%",
    maxWidth: "800px",
    mx: "auto", // centraliza horizontalmente
  }}
>
  <TextField
    variant="outlined"
    label="Buscar por nome"
    value={NomeFiltroInput}
    onChange={handleNomeFilterInput}
    size="medium"
    sx={{ flex: "1 1 60%", minWidth: "280px" }}
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
    to="/servico/editar/novo"
    variant="contained"
    size="medium"
    sx={{
      backgroundColor: "#f5f5f5", 
      color: theme.palette.primary.main, 
      border: `1.5px solid ${theme.palette.primary.main}`, // borda vinho do tema
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
    Novo Serviço
  </Button>
)}

</Box>

{/* Filtros - linha 2 */}
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    gap: 3,
    flexWrap: "wrap",
    width: "100%",
    maxWidth: "800px",
    mx: "auto", // centraliza horizontalmente
    mb: 3,
  }}
>
  <TextField
    variant="outlined"
    label="Preço mínimo"
    type="text"
    value={precoMinInput}
    onChange={handlePrecoMinInputChange}
    size="medium"
    sx={{ flex: "1 1 35%", minWidth: "200px" }}
    inputMode="numeric"
    InputProps={{
      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
      endAdornment: (
        <InputAdornment position="end">
          <IconButton size="small" onClick={aplicarFiltroPreco} sx={{ p: "4px" }}>
            <CheckIcon fontSize="small" />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />

  <TextField
    variant="outlined"
    label="Preço máximo"
    type="text"
    value={precoMaxInput}
    onChange={handlePrecoMaxInputChange}
    size="medium"
    sx={{ flex: "1 1 35%", minWidth: "200px" }}
    inputMode="numeric"
    InputProps={{
      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
      endAdornment: (
        <InputAdornment position="end">
          <IconButton size="small" onClick={aplicarFiltroPrecoMax} sx={{ p: "4px" }}>
            <CheckIcon fontSize="small" />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Box>


    {/* Tabela estilizada */}
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
            {servicos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colunasVisiveis.length} align="center">
                  Nenhum serviço encontrado.
                </TableCell>
              </TableRow>
            ) : (
              servicos.map((servico: Servico, index) => (
                <TableRow
                  key={servico.ID ?? `row-${index}`}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
                >
                  <TableCell>{servico.Nome || "—"}</TableCell>
                  <TableCell>{servico.Descricao || "—"}</TableCell>
                  <TableCell>
                    R${servico.PrecoMin?.toFixed(2) ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    R${servico.PrecoMax?.toFixed(2) ?? "N/A"}
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() =>
                          servico.ID && handleEditarServico(servico.ID)
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
