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
import { useNavigate, useParams } from "react-router-dom";
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

const ManterAgendamento: React.FC = () => {
  const navigate = useNavigate();
  const { agendamentoId } = useParams();
  const { doLogout, userType } = useContext(AuthContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openServicosModal, setOpenServicosModal] = useState(false);
  const [openCabeleireirosModal, setOpenCabeleireirosModal] = useState(false);

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
    setServicosAgendamento,
    servicosDisponiveis,
    cabeleireirosDisponiveis,
    salaoId,
    isLoading,
    isEditing,
    validationErrors,
    handleSubmit,
    handleDelete,
    forbidden,
    canSaveEdit,
  } = useManterAgendamento(userType!, agendamentoId);

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

  const handleAddServico = (servico: Servico) => {
    const novoServicoAgendamento: ServicoAgendamento = {
        PrecoMin: servico.PrecoMin,
        PrecoMax: servico.PrecoMax,
        ServicoId: servico.ID ? servico.ID : "",
        AgendamentoId: agendamentoId ? agendamentoId : "",
    };

    setServicosAgendamento([...servicosAgendamento, novoServicoAgendamento]);
    setOpenServicosModal(false);
  };

  const handleRemoveServico = (servicoId: string) => {
    setServicosAgendamento(
      servicosAgendamento.filter((s) => s.ServicoId !== servicoId)
    );
  };

  const handleSelectCabeleireiro = (cabeleireiro: Cabeleireiro) => {
    setCabeleireiroId(cabeleireiro.ID!);
    setCabeleireiroNome(cabeleireiro.Nome);
    setOpenCabeleireirosModal(false);
  };

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

  if (!salaoId) {
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
            {/* Coluna esquerda - Dados do agendamento */}
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
                    onChange={(e) => setData(e.target.value)}
                    error={Boolean(validationErrors.data)}
                    helperText={validationErrors.data}
                    slotProps={{
                        inputLabel: { shrink: true }
                    }}
                    />
                </Box>                  
                <Box>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      label="Status"
                      onChange={(e) => setStatus(e.target.value as StatusAgendamento)}
                    >
                      {Object.values(StatusAgendamento).map((statusOption) => (
                        <MenuItem key={statusOption} value={statusOption}>
                          {statusOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    required
                    label="ID do Cliente"
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    error={Boolean(validationErrors.clienteId)}
                    helperText={validationErrors.clienteId}
                    placeholder="ID do cliente"
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    required
                    label="Cabeleireiro"
                    value={cabeleireiroNome}
                    onClick={() => setOpenCabeleireirosModal(true)}
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

                {isEditing && !canSaveEdit && (
                  <Alert severity="warning">
                    Não é possível salvar alterações em agendamentos com menos de 3 dias da data atual.
                  </Alert>
                )}
              </Box>
            </Box>

            {/* Coluna direita - Serviços */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Serviços do Agendamento
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
                          <TableCell>{servicoAgendamento.Servico!.Nome}</TableCell>
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
                              onClick={() =>
                                handleRemoveServico(servicoAgendamento.ServicoId)
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
                    Total estimado: {formatCurrency(
                      servicosAgendamento.reduce((sum, s) => sum + s.PrecoMin, 0)
                    )} - {formatCurrency(
                      servicosAgendamento.reduce((sum, s) => sum + s.PrecoMax, 0)
                    )}
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
                disabled={isLoading || (isEditing && !canSaveEdit)}
              >
                {isEditing ? "Salvar Alterações" : "Criar Agendamento"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Modal de Confirmação de Exclusão */}
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

      {/* Modal de Seleção de Serviços */}
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
                  !servicosAgendamento.some(
                    (sa) => sa.ServicoId === servico.ID
                  )
              )
              .map((servico) => (
                <ListItem key={servico.ID} disablePadding>
                  <ListItemButton onClick={() => handleAddServico(servico)}>
                    <ListItemText
                      primary={servico.Nome}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {servico.Descricao}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {formatCurrency(servico.PrecoMin)} - {formatCurrency(servico.PrecoMax)}
                          </Typography>
                        </Box>
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

      {/* Modal de Seleção de Cabeleireiros */}
      <Dialog
        open={openCabeleireirosModal}
        onClose={() => setOpenCabeleireirosModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Selecionar Cabeleireiro</DialogTitle>
        <DialogContent>
          <List>
            {cabeleireirosDisponiveis.map((cabeleireiro) => (
              <ListItem key={cabeleireiro.ID} disablePadding>
                <ListItemButton
                  onClick={() => handleSelectCabeleireiro(cabeleireiro)}
                >
                  <ListItemText
                    primary={cabeleireiro.Nome}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {cabeleireiro.Email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cabeleireiro.Telefone}
                        </Typography>
                      </Box>
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