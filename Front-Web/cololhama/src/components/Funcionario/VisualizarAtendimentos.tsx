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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useVisualizarAtendimentos } from "./useVisualizarAtendimento";
import theme from "../../styles/theme";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { userTypes } from "../../models/tipo-usuario.enum";
import { Atendimento } from "../../models/atendimentoModal";

interface AtendimentoExibicao {
  ID: string;
  NomeCliente: string;
  NomeCabeleireiro: string;
  Data: string;
  Hora: string;
  ValorTotal: number;
  QuantidadeServicos: number;
}

const salaoId = import.meta.env.VITE_SALAO_ID || "1";

const meses = Array.from({ length: 12 }, (_, i) => ({
  valor: (i + 1).toString(),
  nome: new Date(0, i)
    .toLocaleString("pt-BR", { month: "long" })
    .replace(/^\w/, (c) => c.toUpperCase()),
}));

export const VisualizarAtendimentos: React.FC = () => {
  const { userType, userId, doLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [clienteFilter, setClienteFilter] = useState("");
  const [cabelereiroFilter, setCabelereiroFilter] = useState("");
  const [dataFilter, setDataFilter] = useState("");
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState<
    Atendimento | undefined
  >();

  const [clienteFiltroInput, setClienteFilterInput] = useState("");
  const [cabelereiroFiltroInput, setCabelereiroFilterInput] = useState("");
  const [anoFilter, setAnoFilter] = useState("");
  const [mesFilter, setMesFilter] = useState("");
  const [diaFilter, setDiaFilter] = useState("");

  const isCliente = userType === userTypes.Cliente;
  const isCabeleireiro = userType === userTypes.Cabeleireiro;

  const colunas = [
    ...(isCliente ? [] : [{ id: "nomeCliente", label: "Cliente" }]),
    ...(isCabeleireiro
      ? []
      : [{ id: "nomeCabeleireiro", label: "Cabeleireiro" }]),
    { id: "data", label: "Data" },
    { id: "hora", label: "Hora" },
    { id: "valorTotal", label: "Valor Total" },
    { id: "quantidadeServicos", label: "Qtd. Serviços" },
    { id: "acoes", label: "Ações" },
  ];

  const {
    atendimentos,
    totalAtendimentos,
    isLoading,
    error,
    handleEditarAtendimento,
    forbidden,
  } = useVisualizarAtendimentos(
    page + 1,
    rowsPerPage,
    clienteFilter,
    cabelereiroFilter,
    dataFilter,
    salaoId,
    userType!,
    userId
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

  const gerarDias = () =>
    Array.from({ length: 31 }, (_, i) => (i + 1).toString());

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
    setClienteFilter(clienteFiltroInput);
    setCabelereiroFilter(cabelereiroFiltroInput);
    setPage(0);
  };

  const limparFiltros = () => {
    setClienteFilterInput("");
    setCabelereiroFilterInput("");
    setAnoFilter("");
    setMesFilter("");
    setDiaFilter("");
    setClienteFilter("");
    setCabelereiroFilter("");
    setDataFilter("");
    setPage(0);
  };

  const handleVisualizarDetalhes = (atendimento: AtendimentoExibicao) => {
    setAtendimentoSelecionado(atendimento as any);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setAtendimentoSelecionado(undefined);
    setModalAberto(false);
  };

  const formatarDataHora = (data: Date): string => {
    return new Date(data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar atendimentos: {error}</Box>;

  return (
    <Box sx={{ width: "100%", px: { xs: 1, sm: 3 }, py: 2 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}
      >
        Atendimentos Cadastrados
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          mb: 2,
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {!isCliente && (
          <TextField
            variant="outlined"
            label="Buscar Cliente"
            value={clienteFiltroInput}
            onChange={(e) => setClienteFilterInput(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, minWidth: 200, maxWidth: 280 }}
          />
        )}

        {!isCabeleireiro && (
          <TextField
            variant="outlined"
            label="Buscar Cabeleireiro"
            value={cabelereiroFiltroInput}
            onChange={(e) => setCabelereiroFilterInput(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, minWidth: 200, maxWidth: 280 }}
          />
        )}

        <FormControl size="small" sx={{ minWidth: 100 }}>
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

        <Button
          variant="outlined"
          onClick={limparFiltros}
          size="medium"
          sx={{ minWidth: 110, height: 40 }}
        >
          Limpar
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
              {atendimentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colunas.length} align="center">
                    Nenhum atendimento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                atendimentos.map((atendimento: AtendimentoExibicao) => (
                  <TableRow
                    key={atendimento.ID}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    {!isCliente && (
                      <TableCell>{atendimento.NomeCliente || "—"}</TableCell>
                    )}
                    {!isCabeleireiro && (
                      <TableCell>
                        {atendimento.NomeCabeleireiro || "—"}
                      </TableCell>
                    )}
                    <TableCell>
                      {atendimento.Data
                        ? new Date(atendimento.Data).toLocaleDateString("pt-BR")
                        : "—"}
                    </TableCell>
                    <TableCell>{atendimento.Hora || "—"}</TableCell>
                    <TableCell>
                      R$ {atendimento.ValorTotal?.toFixed(2) || "0,00"}
                    </TableCell>
                    <TableCell>{atendimento.QuantidadeServicos || 0}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleVisualizarDetalhes(atendimento)}
                          title="Visualizar detalhes"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() =>
                            atendimento.ID &&
                            handleEditarAtendimento(atendimento.ID)
                          }
                          title="Editar atendimento"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
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
          count={totalAtendimentos}
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

      <Dialog
        open={modalAberto}
        onClose={handleFecharModal}
        maxWidth="sm"
        fullWidth
      >
        {atendimentoSelecionado && (
          <>
            <DialogTitle
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Detalhes do Atendimento
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                  >
                    Data e Hora
                  </Typography>
                  <Typography variant="body1">
                    {atendimentoSelecionado.Data
                      ? formatarDataHora(atendimentoSelecionado.Data)
                      : "Data não disponível"}
                  </Typography>
                </Box>

                {!isCliente && (
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      Cliente
                    </Typography>
                    <Typography variant="body1">
                      {(atendimentoSelecionado as any).NomeCliente ||
                        "Cliente não identificado"}
                    </Typography>
                  </Box>
                )}

                {!isCabeleireiro && (
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      Profissional
                    </Typography>
                    <Typography variant="body1">
                      {(atendimentoSelecionado as any).NomeCabeleireiro ||
                        "Profissional não identificado"}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                  >
                    Valor Total
                  </Typography>
                  <Typography variant="body1">
                    R${" "}
                    {((atendimentoSelecionado as any).ValorTotal || 0).toFixed(
                      2
                    )}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                  >
                    Quantidade de Serviços
                  </Typography>
                  <Typography variant="body1">
                    {(atendimentoSelecionado as any).QuantidadeServicos || 0}{" "}
                    serviço(s)
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button onClick={handleFecharModal} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default VisualizarAtendimentos;
