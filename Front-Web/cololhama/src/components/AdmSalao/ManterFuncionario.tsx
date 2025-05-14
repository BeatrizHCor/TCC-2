import React, { useState } from "react";
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
  FormControlLabel,
  Switch,
  InputAdornment
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useManterFuncionario } from "./useManterFuncionario";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../../styles/styles.global.css";

const ManterFuncionario: React.FC = () => {
  const navigate = useNavigate();
  const { funcionarioId: funcionarioId } = useParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const {
    nome,
    setNome,
    cpf,
    setCpf,
    email,
    setEmail,
    telefone,
    setTelefone,
    auxiliar,
    setAuxiliar,
    salario,
    setSalario,
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    salaoId,
    isLoading,
    isEditing,
    validationErrors,
    handleSubmit,
    handleDelete
  } = useManterFuncionario(funcionarioId);

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

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (rawValue.length <= 3) {
      formattedValue = rawValue;
    } else if (rawValue.length <= 6) {
      formattedValue = `${rawValue.slice(0, 3)}.${rawValue.slice(3)}`;
    } else if (rawValue.length <= 9) {
      formattedValue = `${rawValue.slice(0, 3)}.${rawValue.slice(3, 6)}.${rawValue.slice(6)}`;
    } else {
      formattedValue = `${rawValue.slice(0, 3)}.${rawValue.slice(3, 6)}.${rawValue.slice(6, 9)}-${rawValue.slice(9, 11)}`;
    }
    
    setCpf(formattedValue);
  };

  // Formatar telefone enquanto digita
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (rawValue.length <= 2) {
      formattedValue = rawValue;
    } else if (rawValue.length <= 7) {
      formattedValue = `(${rawValue.slice(0, 2)}) ${rawValue.slice(2)}`;
    } else {
      formattedValue = `(${rawValue.slice(0, 2)}) ${rawValue.slice(2, 7)}-${rawValue.slice(7, 11)}`;
    }
    
    setTelefone(formattedValue);
  };
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
          Acesso não autorizado. Você precisa ser um administrador para acessar esta página.
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
      <Paper elevation={3} sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {isEditing ? "Editar Funcionário" : "Novo Funcionário"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box  sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <Box sx={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Nome Completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                error={Boolean(validationErrors.nome)}
                helperText={validationErrors.nome}
                disabled={isLoading}
              />
            </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                required
                label="CPF"
                value={cpf}
                onChange={handleCpfChange}
                error={Boolean(validationErrors.cpf)}
                helperText={validationErrors.cpf}
                placeholder="000.000.000-00"
                 slotProps={{
                        input: {
                          sx: {
                            maxLength: 14
                          }
                        }
                      }}
                disabled={isLoading}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                required
                label="Telefone"
                value={telefone}
                onChange={handleTelefoneChange}
                error={Boolean(validationErrors.telefone)}
                helperText={validationErrors.telefone}
                placeholder="(00) 00000-0000"
                 slotProps={{
                        input: {
                          sx: {
                            maxLength: 15
                          }
                        }
                      }}
                disabled={isLoading}
              />
            </Box>
          </Box>
              <Box sx={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(validationErrors.email)}
                helperText={validationErrors.email}
                disabled={isLoading}
              />
            </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ flex: 1}}>
              <FormControlLabel
                control={
                  <Switch
                    checked={auxiliar}
                    onChange={(e) => setAuxiliar(e.target.checked)}
                    disabled={isLoading}
                  />
                }
                label="Funcionário Auxiliar"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                type="number"
                label="Salário"
                value={salario === undefined ? '' : salario}
                onChange={(e) => setSalario(e.target.value ? Number(e.target.value) : undefined)}
                error={Boolean(validationErrors.salario)}
                helperText={validationErrors.salario}
                 slotProps={{
                        input: {
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>}                        
                      }}        
                
                disabled={isLoading}
              />
            </Box>
          </Box>
            {!isEditing && (
              <Box sx={{ display: "flex", gap: 3 }}>
                <Box sx={{flex: 1 }}>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={Boolean(validationErrors.password)}
                    helperText={validationErrors.password}
                    disabled={isLoading}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="Confirmar Senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={Boolean(validationErrors.confirmPassword)}
                    helperText={validationErrors.confirmPassword}
                    disabled={isLoading}
                  />
                </Box>
              </Box>
            )}

            {isEditing && (
              <Box sx={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="password"
                  label="Nova Senha (opcional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={Boolean(validationErrors.password)}
                  helperText={validationErrors.password}
                  disabled={isLoading}
                />
              </Box>
            )}

            <Box sx={{ xs: 12 }}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Voltar
                </Button>

                <Box sx={{ display: "flex", gap: 2 }}>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleOpenDeleteDialog}
                      disabled={isLoading}
                    >
                      Excluir
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={isLoading}
                  >
                    {isEditing ? "Salvar Alterações" : "Cadastrar Funcionário"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </form>
      </Paper>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManterFuncionario;