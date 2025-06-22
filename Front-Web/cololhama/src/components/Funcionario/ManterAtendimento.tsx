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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Alert,
  InputAdornment,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useManterAgendamento } from "./useManterAgendamento";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonIcon from "@mui/icons-material/Person";
import "../../styles/styles.global.css";
import { AuthContext } from "../../contexts/AuthContext";
import { StatusAgendamento } from "../../models/StatusAgendamento.enum";
import { Servico } from "../../models/servicoModel";
import { ServicoAgendamento } from "../../models/servicoAgendamentoModel";
import { Cabeleireiro } from "../../models/cabelereiroModel";
import useManterAtendimento from "./useManterAtendimento";
import { ServicoAtendimento } from "../../models/servicoAtendimentoModel";
import { Funcionario } from "../../models/funcionarioModel";

const ManterAtendimento: React.FC = () => {
  const navigate = useNavigate();
  const { doLogout, userType, userId} = useContext(AuthContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openServicosModal, setOpenServicosModal] = useState(false);
  const [openAuxiliarModal, setOpenAuxiliarModal] = useState(false);
  const { state } = useLocation();
  const {
    data: stateData,
    status: stateStatus,
    servicosAgendamento: stateServicos,
    cabeleireiroId: stateCabId,
    cabeleireiroNome: stateCabNome,
    clienteId: stateCliId,
    clienteNome: stateCliNome,
    agendamentoId,
  } = state;
  const {
    data,
    setData,
    status,
    setStatus,
    clienteId,
    setClienteId,
    cabeleireiroId,
    setCabeleireiroId,
    cabeleireiroNome,
    setCabeleireiroNome,
    servicosAgendamento,
    precoTotal,
    setPrecoTotal,
    servicosDisponiveis,
    cabeleireirosDisponiveis,
    salaoId,
    isLoading,
    isEditing,
    validationErrors,
    servicoAtendimento,
    setServicoAtendimento,
    handleSubmit,
    handleDelete,
    forbidden,
    clienteNome,
    setClienteNome,
    clientesDisponiveis,
    auxiliarNome,
    setAuxiliarNome,
    auxiliar,
    setAuxiliar,
    atendimentoId,
    auxiliaresDisponives,
    setAuxiliaresDisponiveis,
  } = useManterAtendimento(
    userType!,
    stateServicos,
    agendamentoId,
    stateData,
    stateCabId,
    stateCabNome,
    stateCliId,
    stateStatus,
    stateCliNome
  );
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

  const handleAddServico = (servico: Servico) => {};

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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

  const handleSelectAuxiliar = (auxiliar: Funcionario) => {
    setAuxiliarNome(auxiliar.Nome);
    setAuxiliar([
      { AuxiliarID: auxiliar.ID || "", AtendimentoId: atendimentoId },
    ]);
    setOpenAuxiliarModal(false);
  };

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

  function handlePrecoItem(ID: string | undefined, value: number): void {
    let servicoAtendimentos = [...servicoAtendimento];
    let index = servicoAtendimentos.findIndex((sa) => sa.ID === ID);
    if (index >= 0) {
      servicoAtendimentos[index] = {
        ...servicoAtendimentos[index],
        PrecoItem: value,
      };
    }
    let total = servicoAtendimentos.reduce(
      (sum: number, s: ServicoAtendimento) => sum + s.PrecoItem,
      0
    );
    setServicoAtendimento(servicoAtendimentos);
    setPrecoTotal(total);
  }

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
          {isEditing ? "Editar Atendimento" : "Novo Atendimento"}
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
                <Box>
                  <TextField
                    fullWidth
                    required
                    type="datetime-local"
                    label="Data e Hora"
                    value={data}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setData(e.target.value);
                    }}
                    error={Boolean(validationErrors.data)}
                    helperText={validationErrors.data}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Box>
                <Box>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      label="Status"
                      onChange={(e) =>
                        setStatus(e.target.value as StatusAgendamento)
                      }
                    >
                      <MenuItem
                        key={StatusAgendamento.Confirmado}
                        value={StatusAgendamento.Confirmado}
                      >
                        {StatusAgendamento.Confirmado}
                      </MenuItem>
                      <MenuItem
                        key={StatusAgendamento.Finalizado}
                        value={StatusAgendamento.Finalizado}
                      >
                        {StatusAgendamento.Finalizado}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    required
                    label="Cliente"
                    value={clienteNome}
                    error={Boolean(validationErrors.clienteId)}
                    helperText={validationErrors.clienteId}
                    placeholder={
                      userType === "Cliente"
                        ? "Cliente atual (você)"
                        : "Clique para selecionar um cliente"
                    }
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
                    error={Boolean(validationErrors.cabeleireiroId)}
                    helperText={validationErrors.cabeleireiroId}
                    placeholder="Clique para selecionar um cabeleireiro"
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
                    sx={{ cursor: "pointer" }}
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    required
                    label="Auxiliar"
                    value={auxiliarNome}
                    error={Boolean(validationErrors.cabeleireiroId)}
                    helperText={validationErrors.cabeleireiroId}
                    onClick={() => setOpenAuxiliarModal(true)}
                    placeholder="Clique para selecionar um cabeleireiro"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            {auxiliarNome !== "" ? (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAuxiliarNome("");
                                  setAuxiliar([]);
                                }}
                              >
                                <RemoveIcon />
                              </IconButton>
                            ) : (
                              <PersonIcon />
                            )}
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ cursor: "pointer" }}
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Serviços do Atendimento
              </Typography>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
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
                      <TableCell align="right">Preço</TableCell>
                      <TableCell align="center">Ação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {servicoAtendimento.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary">
                            Nenhum serviço adicionado
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      servicoAtendimento.map((servicoAtendimento) => {
                        let servico = servicosDisponiveis.find(
                          (s) => s.ID === servicoAtendimento.ServicoId
                        );
                        return (
                          <TableRow key={servicoAtendimento.ID}>
                            <TableCell>
                              {servico?.Nome || "Serviço não encontrado"}
                            </TableCell>
                            <TableCell align="right" sx={{ padding: 0 }}>
                              <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{
                                  "& .MuiInputBase-root": {
                                    padding: 0,
                                    height: "100%",
                                  },
                                  "& input": {
                                    padding: "8px",
                                  },
                                }}
                                value={formatCurrency(
                                  servicoAtendimento.PrecoItem
                                )}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(
                                    /[^\d]/g,
                                    ""
                                  );
                                  const float = parseFloat(raw) / 100;
                                  handlePrecoItem(servicoAtendimento.ID, float);
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton size="small" color="error">
                                <RemoveIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {servicoAtendimento.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    Total: {formatCurrency(precoTotal)}
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
              {isEditing && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleOpenDeleteDialog}
                >
                  Excluir
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
                disabled={isLoading}
              >
                {isEditing ? "Salvar Alterações" : "Criar Atendimento"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este atendimento? Esta ação não pode
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

      <Dialog
        open={openServicosModal}
        onClose={() => setOpenServicosModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Selecionar Serviço</DialogTitle>
        <DialogContent>
          <List>
            {servicosDisponiveis
              .filter(
                (servico) =>
                  !servicoAtendimento.some((sa) => sa.ServicoId === servico.ID)
              )
              .map((servico) => (
                <ListItem key={servico.ID} disablePadding>
                  <ListItemButton onClick={() => handleAddServico(servico)}>
                    <ListItemText
                      primary={servico.Nome}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {servico.Descricao}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {formatCurrency(servico.PrecoMin)} -{" "}
                            {formatCurrency(servico.PrecoMax)}
                          </Typography>
                        </>
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
        open={openAuxiliarModal}
        onClose={() => setOpenAuxiliarModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Selecionar Auxiliar</DialogTitle>
        <DialogContent>
          <List>
            {auxiliaresDisponives.map((auxiliar) => (
              <ListItem key={auxiliar.ID} disablePadding>
                <ListItemButton onClick={() => handleSelectAuxiliar(auxiliar)}>
                  <ListItemText
                    primary={auxiliar.Nome}
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {auxiliar.Email}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAuxiliarModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManterAtendimento;
