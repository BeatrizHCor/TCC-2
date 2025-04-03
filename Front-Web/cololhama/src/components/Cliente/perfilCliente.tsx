import "../../styles/styles.global.css";
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Stack,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { useClienteCadastro } from "./useCadastroCliente";
import theme from "../../styles/theme";

interface PerfilClienteProps {
  salaoId: string;
}

export const PerfilCliente: React.FC<PerfilClienteProps> = ({ salaoId }) => {
  const {
    cliente,
    auth,
    cpfFormatado,
    telefoneFormatado,
    confirmacaoSenha,
    errors,
    loading,
    handleChange,
    handleAuthChange,
    handleCPFChange,
    handleTelefoneChange,
    handleConfirmacaoSenhaChange,
    handleSubmit,
    setCliente,
    setAuth,
    setConfirmacaoSenha,
    setErrors,
    setTelefoneFormatado,
  } = useClienteCadastro(salaoId);

  const [editMode, setEditMode] = useState(false);
  const [clienteBackup, setClienteBackup] = useState({ ...cliente });
  const [authBackup, setAuthBackup] = useState({ ...auth });
  const [telefoneFormatadoBackup, setTelefoneFormatadoBackup] = useState(telefoneFormatado);

  const originalSetTelefoneFormatado = setTelefoneFormatado || ((value: string) => {
    console.log("Telephone formatting fallback used");
  });

  const toggleEditMode = () => {
    if (editMode) {
      setCliente({ ...clienteBackup });
      setAuth({ ...authBackup });
      setConfirmacaoSenha("");
      setErrors({});
      
      if (typeof originalSetTelefoneFormatado === 'function') {
        originalSetTelefoneFormatado(telefoneFormatadoBackup);
      }
    } else {
      setClienteBackup({ ...cliente });
      setAuthBackup({ ...auth });
      setTelefoneFormatadoBackup(telefoneFormatado);
    }
    setEditMode(!editMode);
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="center" alignItems="center" height="90vh">
        <Box flex={1} display="flex" justifyContent="center">
          <img
            src="/icone.svg"
            alt="Logo"
            style={{
              width: "450px",
              height: "450px",
              filter: "invert(16%) sepia(90%) saturate(400%) hue-rotate(-5deg)",
            }}
          />
        </Box>

        <Box flex={1} display="flex" justifyContent="flex-start">
          <Paper elevation={3} sx={{ p: 5, width: 520 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.primary.main }}>
              {editMode ? "Editar Perfil" : "Seu Perfil"}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                  Informações Pessoais
                </Typography>

                <TextField
                  name="Nome"
                  label="Nome Completo"
                  value={cliente.Nome}
                  required
                  onChange={handleChange}
                  error={!!errors.nome}
                  helperText={errors.nome}
                  fullWidth
                  InputProps={{
                    readOnly: !editMode,
                  }}
                  sx={{
                    backgroundColor: editMode ? "white" : "#f8f8f8",
                  }}
                  disabled={!editMode}
                />

                <Box sx={{ mx: -1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <TextField
                        label="CPF"
                        value={cpfFormatado}
                        fullWidth
                        InputProps={{ readOnly: true }}
                        sx={{
                          backgroundColor: "#f8f8f8",
                        }}
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Telefone"
                        value={telefoneFormatado}
                        onChange={handleTelefoneChange}
                        error={!!errors.telefone}
                        helperText={errors.telefone}
                        inputProps={{ maxLength: 15 }}
                        fullWidth
                        InputProps={{
                          readOnly: !editMode,
                        }}
                        sx={{
                          backgroundColor: editMode ? "white" : "#f8f8f8",
                        }}
                        disabled={!editMode}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <TextField
                  name="email"
                  label="Email"
                  value={auth.email}
                  required
                  type="email"
                  onChange={handleAuthChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  InputProps={{
                    readOnly: !editMode,
                  }}
                  sx={{
                    backgroundColor: editMode ? "white" : "#f8f8f8",
                  }}
                  disabled={!editMode}
                />

                <Typography variant="h6" sx={{ color: theme.palette.primary.main, mt: 2 }}>
                  Senha
                </Typography>

                <TextField
                  name="senha"
                  label="Senha"
                  type="password"
                  value={auth.senha || ""}
                  required
                  onChange={handleAuthChange}
                  error={!!errors.senha}
                  helperText={errors.senha}
                  fullWidth
                  InputProps={{
                    readOnly: !editMode,
                  }}
                  sx={{
                    backgroundColor: editMode ? "white" : "#f8f8f8",
                  }}
                  disabled={!editMode}
                />

                {editMode && (
                  <TextField
                    label="Confirmar Senha"
                    required
                    type="password"
                    value={confirmacaoSenha}
                    onChange={handleConfirmacaoSenhaChange}
                    error={!!errors.confirmacaoSenha}
                    helperText={errors.confirmacaoSenha}
                    fullWidth
                  />
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={toggleEditMode}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      "&:hover": { bgcolor: "#f8f8f8" },
                    }}
                  >
                    {editMode ? "Cancelar" : "Editar Perfil"}
                  </Button>

                  {editMode && (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: "#fff",
                        "&:hover": { bgcolor: "#600000" },
                      }}
                      disabled={loading}
                    >
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  )}
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default PerfilCliente;