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
  Chip,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useVisualizarAtendimentos } from "./useVisualizarAtendimento";
import "../../styles/styles.global.css";
import theme from "../../styles/theme";
import { Link, useNavigate } from "react-router-dom";
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

const SalaoID = import.meta.env.VITE_SALAO_ID || "1";

export const VisualizarAtendimentos: React.FC = () => {
  const { userType, userId } = useContext(AuthContext);
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
  const navigate = useNavigate();

  const colunas = [
    ...(isCliente ? [] : [{ id: "nomeCliente", label: "Cliente" }]),
    ...(isCabeleireiro
      ? []
      : [{ id: "nomeCabeleireiro", label: "Cabeleireiro" }]),
    { id: "data", label: "Data" },
    { id: "hora", label: "Hora" },
    { id: "valorTotal", label: "Valor Total" },
    { id: "quantidadeServicos", label: "Qtd. Serviços" },
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
    SalaoID,
    userType!,
    userId
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
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
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClienteFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClienteFilterInput(e.target.value);
  };

  const handleCabelereiroFilterInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCabelereiroFilterInput(e.target.value);
  };
  const construirFiltroData = () => {
    let filtroData = "";
    if (anoFilter) {
      filtroData = anoFilter;
      if (mesFilter) {
        filtroData += `-${String(mesFilter).padStart(2, "0")}`;
        if (diaFilter) {
          filtroData += `-${String(diaFilter).padStart(2, "0")}`;
        }
      }
    }
    return filtroData;
  };
  const aplicarFiltros = () => {
    setClienteFilter(clienteFiltroInput);
    setCabelereiroFilter(cabelereiroFiltroInput);
    setDataFilter(construirFiltroData());
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

  if (forbidden) {
    return (
      <Box sx={{ width: "100%", p: 2, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Acesso negado. Você não tem permissão para visualizar esta página.
        </Typography>
      </Box>
    );
  }

  if (isLoading) return <Box>Carregando...</Box>;
  if (error) return <Box>Erro ao carregar atendimentos: {error}</Box>;

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Atendimentos
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filtros
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            flexWrap: "wrap",
            alignItems: { xs: "stretch", sm: "center" },
            width: "100%",
          }}
        >
          {!isCliente && (
            <TextField
              variant="outlined"
              label="Cliente"
              value={clienteFiltroInput}
              onChange={handleClienteFilterInput}
              fullWidth
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 180 } }}
            />
          )}
          {!isCabeleireiro && (
            <TextField
              variant="outlined"
              label="Cabeleireiro"
              value={cabelereiroFiltroInput}
              onChange={handleCabelereiroFilterInput}
              fullWidth
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 180 } }}
            />
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              flex: 1,
              minWidth: { xs: "100%", sm: "auto" },
            }}
          >
            <FormControl
              fullWidth
              size="small"
              sx={{ minWidth: { xs: "30%", sm: 120 } }}
            >
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
            <FormControl
              fullWidth
              size="small"
              sx={{ minWidth: { xs: "30%", sm: 120 } }}
            >
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
            <FormControl
              fullWidth
              size="small"
              sx={{ minWidth: { xs: "30%", sm: 100 } }}
            >
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
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Button
              variant="contained"
              onClick={aplicarFiltros}
              fullWidth={true}
            >
              Buscar
            </Button>
            <Button variant="outlined" onClick={limparFiltros} fullWidth={true}>
              Limpar Filtros
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                {colunas.map((coluna) => (
                  <TableCell key={coluna.id}>{coluna.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {atendimentos.map((atendimento: AtendimentoExibicao) => (
                <TableRow
                  key={atendimento.ID}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    atendimento.ID && handleEditarAtendimento(atendimento.ID)
                  }
                >
                  {!isCliente && (
                    <TableCell>{atendimento.NomeCliente}</TableCell>
                  )}
                  {!isCabeleireiro && (
                    <TableCell>{atendimento.NomeCabeleireiro}</TableCell>
                  )}
                  <TableCell>
                    {atendimento.Data
                      ? new Date(atendimento.Data).toLocaleDateString("pt-BR")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{atendimento.Hora}</TableCell>
                  <TableCell>
                    R$ {atendimento.ValorTotal?.toFixed(2) || "0,00"}
                  </TableCell>
                  <TableCell>{atendimento.QuantidadeServicos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalAtendimentos}
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
      <Dialog
        open={modalAberto}
        onClose={handleFecharModal}
        maxWidth="sm"
        fullWidth
      >
        {atendimentoSelecionado && (
          <>
            <DialogTitle>Detalhes do Atendimento</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Data e Hora
                  </Typography>
                  <Typography variant="body1">
                    {formatarDataHora(atendimentoSelecionado.Data)}
                  </Typography>
                </Box>

                <Box sx={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Cliente
                  </Typography>
                  <Typography variant="body1">
                    {atendimentoSelecionado.Agendamentos[0].Cliente?.Nome ||
                      `ID: ${atendimentoSelecionado.Agendamentos[0].ClienteID}`}
                  </Typography>
                </Box>
                <Box sx={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Profissional
                  </Typography>
                  <Typography variant="body1">
                    {atendimentoSelecionado.Agendamentos[0].Cabeleireiro
                      ?.Nome ||
                      `ID: ${atendimentoSelecionado.Agendamentos[0].CabeleireiroID}`}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleFecharModal} color="primary">
                Fechar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  navigate(`/atendimento/editar/${atendimentoSelecionado.ID}`)
                }
              >
                Ir para página do atendimento
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default VisualizarAtendimentos;
