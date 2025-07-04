import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Alert,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { ptBR } from "date-fns/locale";
import { useNavigate, useParams } from "react-router-dom";
import { useManterAgendamento } from "./useManterAgendamento";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BlockIcon from "@mui/icons-material/Block";
import "../../styles/styles.global.css";
import { AuthContext } from "../../contexts/AuthContext";
import { StatusAgendamento } from "../../models/StatusAgendamento.enum";
import { Servico } from "../../models/servicoModel";
import { ServicoAgendamento } from "../../models/servicoAgendamentoModel";
import { Cabeleireiro } from "../../models/cabelereiroModel";
import { Cliente } from "../../models/clienteModel";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { userTypes } from "../../models/tipo-usuario.enum";

function formatDateToLocalDateTimeString(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}
const ManterAgendamento: React.FC = () => {
  const navigate = useNavigate();
  const { agendamentoId: agendamentoId } = useParams();
  const isEditing = !!agendamentoId;
  const { doLogout, userType, userId } = useContext(AuthContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openServicosModal, setOpenServicosModal] = useState(false);
  const [openCabeleireirosModal, setOpenCabeleireirosModal] = useState(false);
  const [openClientesModal, setOpenClientesModal] = useState(false);
  const [clienteSearch, setClienteSearch] = useState("");
  const [cabeleireiroSearch, setCabeleireiroSearch] = useState("");
  const [servicoSearch, setServicoSearch] = useState("");
  const {
    data,
    setData,
    horaOriginal,
    status,
    setStatus,
    clienteId,
    setClienteId,
    cabeleireiroId,
    setCabeleireiroId,
    cabeleireiroNome,
    setCabeleireiroNome,
    servicosAgendamento,
    setServicosAgendamento,
    servicosDisponiveis,
    clienteNome,
    setClienteNome,
    clientesDisponiveis,
    cabeleireirosDisponiveis,
    salaoId,
    isLoading,
    isEditing: hookIsEditing,
    validationErrors,
    handleSubmit,
    handleDelete,
    forbidden,
    canSaveEdit,
    horariosOcupados,
    loadingHorarios,
    isHorarioOcupado,
    isTimeSlotOccupied,
    setCabeleireiroIdWithHorarios,
    cofirmarAtendimento,
    setValidationErrors,
    atendimentoId,
    handleCancel
  } = useManterAgendamento(userType!, agendamentoId, userId);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    await handleDelete();
    handleCloseDeleteDialog();
  };
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };
  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };
  const handleConfirmCancel = async () => {
    await handleCancel();
    handleCloseCancelDialog();
  }

  const handleAddServico = (servico: Servico) => {
    const novoServicoAgendamento: ServicoAgendamento = {
      Nome: servico.Nome,
      PrecoMin: servico.PrecoMin,
      PrecoMax: servico.PrecoMax,
      ServicoId: servico.ID ? servico.ID : "",
      AgendamentoId: agendamentoId ? agendamentoId : "",
    };

    const novosServicos = [...servicosAgendamento, novoServicoAgendamento];
    setServicosAgendamento(novosServicos);
    setOpenServicosModal(false);

    if (data && horariosOcupados.length > 0) {
      const isOcupadoComNovosServicos = isTimeSlotOccupied(
        new Date(data),
        new Date(data).getHours(),
        novosServicos
      );

      if (isOcupadoComNovosServicos) {
        setValidationErrors((prev) => ({
          ...prev,
          data: "Este horário tem indisponibilidade de tempo com os novos serviços",
        }));
      }
    }

  };

  const handleRemoveServico = (servicoId: string) => {
    const novosServicos = servicosAgendamento.filter((s) => s.ServicoId !== servicoId);
    setServicosAgendamento(novosServicos);

    if (data && horariosOcupados.length > 0) {
      const isOcupadoComNovosServicos = isHorarioOcupado(
        data,
        isEditing,
        horaOriginal,
        novosServicos
      );

      if (!isOcupadoComNovosServicos && validationErrors.data) {
        setValidationErrors((prev) => ({
          ...prev,
          data: undefined,
        }));
      }
    }
  };

  const handleSelectCabeleireiro = (cabeleireiro: Cabeleireiro) => {
    setCabeleireiroIdWithHorarios(cabeleireiro.ID!);
    setCabeleireiroNome(cabeleireiro.Nome);
    setOpenCabeleireirosModal(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getDataTimeHelperText = () => {
    if (!cabeleireiroId) {
      return "Selecione um cabeleireiro primeiro";
    }
    if (loadingHorarios) {
      return "Verificando disponibilidade...";
    }
    if (data && isHorarioOcupado(data, isEditing, horaOriginal)) {
      const duracaoMinutos = servicosAgendamento.length * 40;
      return `Este horário conflita com outro agendamento (duração: ${duracaoMinutos}min)`;
    }
    if (validationErrors.data) {
      return validationErrors.data;
    }
    const duracaoEstimada = Math.max(1, servicosAgendamento.length) * 40;
    return `Selecione data e horário (duração estimada: ${duracaoEstimada}min)`;
  };

  const getDataTimeHelperColor = () => {
    if (!cabeleireiroId || loadingHorarios) {
      return "text.secondary";
    }
    if (data && isHorarioOcupado(data)) {
      return "error";
    }
    if (validationErrors.data) {
      return "error";
    }
    return "text.secondary";
  };

  useEffect(() => {
    if (forbidden) {
      doLogout();
    }
  }, [forbidden]);

  while (!salaoId && isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userType || !userId) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Acesso não autorizado. Você precisa ser um administrador de salão.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  const handleConfirmar = async (e: React.FormEvent) => {
    try {
      await cofirmarAtendimento(e);
    } catch (e) {
      console.log(e);
    }
  };
  const handleIrAtendimento = async (e: React.FormEvent) => {
    try {
      navigate(`/atendimento/editar/${atendimentoId}`, {
        state: {
          data: data,
          status: status,
          servicosAgendamento: servicosAgendamento,
          cabeleireiroId: cabeleireiroId,
          cabeleireiroNome: cabeleireiroNome,
          clienteId: clienteId,
          clienteNome: clienteNome,
          agendamentoId: agendamentoId,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 1, sm: 3 },
          maxWidth: { xs: "100%", sm: "1200px" },
          mx: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontSize: { xs: "1.2rem", sm: "2rem" } }}
        >
          {isEditing ? "Editar Agendamento" : "Novo Agendamento"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 2, sm: 3 },
                }}
              >
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ptBR}
                >
                  <DateTimePicker
                    label="Data e Hora"
                    value={data ? new Date(data) : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        const localDateTime = formatDateToLocalDateTimeString(newValue);
                        setData(localDateTime);
                      } else {
                        setData("");
                      }
                    }}
                    disabled={
                      !canSaveEdit || loadingHorarios || !cabeleireiroId || status !== StatusAgendamento.Agendado
                    }
                    shouldDisableTime={(timeValue, clockType) => {
                      if (clockType === "hours") {
                        const hour = Number(timeValue);
                        if (data) {
                          const selectedDate = new Date(data.split("T")[0]);
                          const selectedDateTime = new Date(selectedDate);
                          selectedDateTime.setHours(hour, 0, 0, 0);

                          if (isEditing && horaOriginal) {
                            const originalDate = new Date(horaOriginal);
                            if (selectedDateTime.getTime() === originalDate.getTime()) {
                              return false;
                            }
                          }

                          return isTimeSlotOccupied(selectedDate, hour, servicosAgendamento);
                        }
                      }
                      return false;
                    }}

                    minDateTime={new Date()}
                    format="dd/MM/yyyy HH:mm"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error:
                          Boolean(validationErrors.data) ||
                          Boolean(data && isHorarioOcupado(data, isEditing, horaOriginal)),
                        helperText: getDataTimeHelperText(),
                      },
                    }}
                  />
                </LocalizationProvider>
                {isEditing && (
                  <Box>
                    <TextField
                      fullWidth
                      label="Status"
                      value={status}
                      slotProps={{
                        input: { readOnly: true },
                      }}
                      variant="outlined"
                      margin="normal"
                    />
                  </Box>
                )}
                <Box>
                  <TextField
                    fullWidth
                    required
                    label="Cliente"
                    value={clienteNome}
                    onClick={() => {
                      if (userType !== "Cliente" && !isEditing)
                        setOpenClientesModal(true);
                    }}
                    error={Boolean(validationErrors.clienteId)}
                    helperText={validationErrors.clienteId}
                    placeholder={
                      userType === "Cliente"
                        ? "Cliente atual (você)"
                        : "Clique para selecionar um cliente"
                    }
                    disabled={!canSaveEdit || loadingHorarios || status !== StatusAgendamento.Agendado}
                    slotProps={{
                      input: { readOnly: true },
                    }}
                    sx={{
                      cursor:
                        userType === "Cliente" || isEditing
                          ? "not-allowed"
                          : "pointer",
                    }}
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    required
                    label="Cabeleireiro"
                    value={cabeleireiroNome}
                    onClick={() => {
                      if (userType !== "Cabeleireiro")
                        setOpenCabeleireirosModal(true);
                    }}
                    error={Boolean(validationErrors.cabeleireiroId)}
                    helperText={validationErrors.cabeleireiroId}
                    placeholder={
                      userType === "Cabeleireiro"
                        ? "Cabeleireiro atual (você)"
                        : "Clique para selecionar um cabeleireiro"
                    }
                    disabled={!canSaveEdit || loadingHorarios || status !== StatusAgendamento.Agendado}
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      cursor:
                        userType === "Cabeleireiro" ? "not-allowed" : "pointer",
                    }}
                  />
                </Box>

                {isEditing && !canSaveEdit && (
                  <Alert severity="warning">
                    Não é possível salvar alterações em agendamentos marcados a
                    3 dias ou menos da data atual.
                  </Alert>
                )}

                {!cabeleireiroId && (
                  <Alert severity="info">
                    Selecione um cabeleireiro para poder escolher a data e hora
                    do agendamento.
                  </Alert>
                )}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Serviços do Agendamento
              </Typography>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                disabled={!canSaveEdit || loadingHorarios || status !== StatusAgendamento.Agendado}
                onClick={() => setOpenServicosModal(true)}
                sx={{ mb: 2 }}
                fullWidth
              >
                Adicionar Serviço
              </Button>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Serviço</TableCell>
                      <TableCell align="right">Preço Min</TableCell>
                      <TableCell align="right">Preço Max</TableCell>
                      <TableCell align="center">Ação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {servicosAgendamento.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary">
                            Nenhum serviço adicionado
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      servicosAgendamento.map((servicoAgendamento) => (
                        <TableRow key={servicoAgendamento.ID}>
                          <TableCell>
                            {servicoAgendamento.Nome ||
                              "Serviço não encontrado"}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(servicoAgendamento.PrecoMin)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(servicoAgendamento.PrecoMax)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              disabled={
                                !canSaveEdit ||
                                loadingHorarios ||
                                !cabeleireiroId ||
                                status !== StatusAgendamento.Agendado
                              }
                              onClick={() =>
                                handleRemoveServico(
                                  servicoAgendamento.ServicoId
                                )
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {servicosAgendamento.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    Total estimado:{" "}
                    {formatCurrency(
                      servicosAgendamento.reduce((sum, s) => sum + s.PrecoMin, 0)
                    )}{" "}
                    -{" "}
                    {formatCurrency(
                      servicosAgendamento.reduce((sum, s) => sum + s.PrecoMax, 0)
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tempo estimado: {servicosAgendamento.length * 40} minutos
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              justifyContent: "space-between",
              mt: 4,
              flexDirection: { xs: "column-reverse", sm: "row" },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Voltar
            </Button>
            <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
              {isEditing && [
                userTypes.AdmSalao,
                userTypes.AdmSistema,
              ].includes(userType) && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleOpenDeleteDialog}
                    disabled={(isEditing && !canSaveEdit) || !!atendimentoId}
                  >
                    Excluir
                  </Button>
                )}
              {isEditing && status === StatusAgendamento.Agendado && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleOpenCancelDialog}
                  disabled={(isEditing && !canSaveEdit) || !!atendimentoId}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={isLoading || (isEditing && !canSaveEdit) || status !== StatusAgendamento.Agendado || !canSaveEdit}
              >
                {isEditing ? "Salvar Alterações" : "Criar Agendamento"}
              </Button>
              {isEditing && userType !== "Cliente" && status === StatusAgendamento.Agendado ? (
                <Button
                  variant="contained"
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  onClick={handleConfirmar}
                >
                  Confirmar Atendimento
                </Button>
              ) : null}
              {isEditing && atendimentoId ? (
                <Button
                  variant="contained"
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  onClick={handleIrAtendimento}
                >
                  Ir para Atendimento
                </Button>
              ) : null}
            </Box>
          </Box>
        </form>
      </Paper>
      <Dialog
        open={openClientesModal}
        onClose={() => setOpenClientesModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Selecionar Cliente</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Buscar cliente"
            value={clienteSearch}
            onChange={(e) => setClienteSearch(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {clientesDisponiveis
              ?.filter((cliente) =>
                cliente.Nome.toLowerCase().includes(clienteSearch.toLowerCase())
              )
              .map((cliente) => (
                <ListItem key={cliente.ID} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setClienteId(cliente.ID!);
                      setClienteNome(cliente.Nome);
                      setOpenClientesModal(false);
                    }}
                  >
                    <ListItemText
                      primary={cliente.Nome}
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {cliente.Email}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClientesModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este agendamento? Esta ação não pode
            ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle>Confirmar Cancelamento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja cancelar este agendamento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Voltar</Button>
          <Button onClick={handleConfirmCancel} color="error" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openServicosModal}
        onClose={() => setOpenServicosModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Selecionar Serviço</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Buscar serviço"
            value={servicoSearch}
            onChange={(e) => setServicoSearch(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {servicosDisponiveis
              .filter(
                (servico) =>
                  !servicosAgendamento.some((sa) => sa.ServicoId === servico.ID) &&
                  servico.Nome.toLowerCase().includes(servicoSearch.toLowerCase())
              )
              .map((servico) => (
                <ListItem key={servico.ID} disablePadding>
                  <ListItemButton onClick={() => handleAddServico(servico)}>
                    <ListItemText
                      primary={servico.Nome}
                      secondary={
                        <span>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            component="span"
                          >
                            {servico.Descricao}
                          </Typography>
                          <br />
                          <Typography
                            variant="body2"
                            color="primary"
                            component="span"
                          >
                            {formatCurrency(servico.PrecoMin)} -{" "}
                            {formatCurrency(servico.PrecoMax)}
                          </Typography>
                        </span>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenServicosModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCabeleireirosModal}
        onClose={() => setOpenCabeleireirosModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Selecionar Cabeleireiro</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Buscar cabeleireiro"
            value={cabeleireiroSearch}
            onChange={(e) => setCabeleireiroSearch(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {cabeleireirosDisponiveis
              .filter((cabeleireiro) =>
                cabeleireiro.Nome.toLowerCase().includes(cabeleireiroSearch.toLowerCase())
              )
              .map((cabeleireiro) => (
                <ListItem key={cabeleireiro.ID} disablePadding>
                  <ListItemButton
                    onClick={() => handleSelectCabeleireiro(cabeleireiro)}
                  >
                    <ListItemText
                      primary={cabeleireiro.Nome}
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCabeleireirosModal(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManterAgendamento;
