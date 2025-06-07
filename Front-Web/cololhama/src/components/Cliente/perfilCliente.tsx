import "../../styles/styles.global.css";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Stack,
  Box,
  Button,
  CircularProgress,
  Fade,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Error } from "@mui/icons-material";
import { usePerfilCliente } from "./usePerfilCliente";
import theme from "../../styles/theme";
import { AuthContext } from "../../contexts/AuthContext";
import AuthGuard from "../../utils/AuthGuard";
import { userTypes } from "../../models/tipo-usuario.enum";

interface PerfilClienteProps {}

const salaoId = import.meta.env.SALAO_ID || "1";

export const PerfilCliente: React.FC<PerfilClienteProps> = () => {
  const { userId, checkLocalStorage } = useContext(AuthContext);
  const {
    perfil,
    cpfFormatado,
    telefoneFormatado,
    confirmacaoSenha,
    errors,
    loading,
    saveSuccess,
    setSaveSuccess,
    isInitialized,
    handleChange,
    handleTelefoneChange,
    handleSubmit,
    saveError,
    handleConfirmacaoSenhaChange,
  } = usePerfilCliente(userId);

  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  if (!isInitialized) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <AuthGuard allowed={[userTypes.Cliente, userTypes.AdmSistema]}>
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
        >
          <Box flex={1} display="flex" justifyContent="center">
            <img
              src="/icone.svg"
              alt="Logo"
              style={{
                width: "450px",
                height: "450px",
                filter:
                  "invert(16%) sepia(90%) saturate(400%) hue-rotate(-5deg)",
              }}
            />
          </Box>

          <Box flex={1} display="flex" justifyContent="flex-start">
            <Paper
              elevation={3}
              sx={{ p: 5, width: 520, position: "relative" }}
            >
              {saveSuccess && (
                <Fade in={saveSuccess}>
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="rgba(255, 255, 255, 0.9)"
                    zIndex={10}
                    sx={{ borderRadius: 1 }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 80, color: "green" }} />
                    <Typography variant="h6" sx={{ mt: 2, color: "green" }}>
                      Perfil salvo com sucesso!
                    </Typography>
                  </Box>
                </Fade>
              )}

              {saveError && (
                <Fade in={saveError}>
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="rgba(255, 255, 255, 0.9)"
                    zIndex={10}
                    sx={{ borderRadius: 1 }}
                  >
                    <Error sx={{ fontSize: 80, color: "red" }} />
                    <Typography variant="h6" sx={{ mt: 2, color: "red" }}>
                      Erro ao Salvar Perfil. Tente Novamente.
                    </Typography>
                  </Box>
                </Fade>
              )}

              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ color: theme.palette.primary.main }}
              >
                {editMode ? "Editar Perfil" : "Seu Perfil"}
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    Informações Pessoais
                  </Typography>

                  <TextField
                    name="Nome"
                    label="Nome Completo"
                    value={perfil.Nome || ""}
                    required
                    onChange={handleChange}
                    error={!!errors.nome}
                    helperText={errors.nome}
                    fullWidth
                    disabled={!editMode}
                    sx={{
                      backgroundColor: editMode ? "white" : "#f8f8f8",
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
                  />

                  <Box sx={{ mx: -1 }}>
                    <Box display="flex" gap={2} alignItems="center">
                      <Box flex={1}>
                        <TextField
                          label="CPF"
                          value={cpfFormatado}
                          fullWidth
                          disabled={true}
                          sx={{
                            backgroundColor: "#f8f8f8",
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                            },
                          }}
                        />
                      </Box>
                      <Box flex={1}>
                        <TextField
                          label="Telefone"
                          value={telefoneFormatado || ""}
                          onChange={handleTelefoneChange}
                          error={!!errors.telefone}
                          helperText={errors.telefone}
                          fullWidth
                          disabled={!editMode}
                          inputProps={{
                            maxLength: 15,
                          }}
                          sx={{
                            backgroundColor: editMode ? "white" : "#f8f8f8",
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{ color: theme.palette.primary.main, mt: 2 }}
                  >
                    Senha
                  </Typography>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={toggleEditMode}
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "&:hover": { bgcolor: "#f8f8f8" },
                      }}
                      disabled={loading}
                    >
                      {editMode ? "Cancelar" : "Editar Perfil"}
                    </Button>

                    {editMode && (
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={
                          loading && (
                            <CircularProgress size={20} color="inherit" />
                          )
                        }
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: "#fff",
                          "&:hover": { bgcolor: "#600000" },
                        }}
                        disabled={loading || saveSuccess}
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
    </AuthGuard>
  );
};

export default PerfilCliente;
