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
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Error } from "@mui/icons-material";
import { usePerfilCliente } from "./usePerfilCliente";
import theme from "../../styles/theme";
import { AuthContext } from "../../contexts/AuthContext";
import AuthGuard from "../../utils/AuthGuard";
import { userTypes } from "../../models/tipo-usuario.enum";

interface PerfilClienteProps { }

const salaoId = import.meta.env.SALAO_ID || "1";

export const PerfilCliente: React.FC<PerfilClienteProps> = () => {
  const { userId, checkLocalStorage } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [editMode, setEditMode] = useState(false);

  const {
    perfil,
    cpfFormatado,
    telefoneFormatado,
    novaSenha,
    confirmacaoSenha,
    errors,
    loading,
    saveSuccess,
    setSaveSuccess,
    isInitialized,
    handleChange,
    handleTelefoneChange,
    handleNovaSenhaChange,
    handleSubmit,
    saveError,
    handleConfirmacaoSenhaChange,
  } = usePerfilCliente(userId, setEditMode);

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
      <Container maxWidth="lg" sx={{ px: isMobile ? 2 : 3 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={isMobile ? "auto" : "90vh"}
          flexDirection={isMobile ? "column" : "row"}
          py={isMobile ? 4 : 0}
          gap={isMobile ? 4 : 0}
        >
          {!isMobile && (
            <Box flex={1} display="flex" justifyContent="flex-end" pr={4}>
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
          )}

          <Box
            flex={1}
            display="flex"
            justifyContent={isMobile ? "center" : "flex-start"}
            width={isMobile ? "100%" : "auto"}
          >
            <Paper
              elevation={3}
              sx={{
                p: isMobile ? 3 : 5,
                width: isMobile ? "100%" : 520,
                maxWidth: "100%",
                position: "relative",
              }}
            >
              {saveError && (
                <Fade in={saveError}>
                  <Box
                    position="fixed"
                    bottom={20}
                    right={20}
                    bgcolor="rgba(255, 0, 0, 0.8)"
                    color="white"
                    px={3}
                    py={1.5}
                    borderRadius={2}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    zIndex={1300}
                    boxShadow={3}
                  >
                    <Error />
                    <Typography>Erro ao Salvar Perfil. Tente Novamente.</Typography>
                  </Box>
                </Fade>
              )}

              {saveSuccess && (
                <Fade in={saveSuccess}>
                  <Box
                    position="fixed"
                    bottom={20}
                    right={20}
                    bgcolor="rgba(0, 128, 0, 0.8)"
                    color="white"
                    px={3}
                    py={1.5}
                    borderRadius={2}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    zIndex={1300}
                    boxShadow={3}
                  >
                    <CheckCircleIcon />
                    <Typography>Perfil salvo com sucesso!</Typography>
                  </Box>
                </Fade>
              )}

              <Typography
                variant={isMobile ? "h5" : "h4"}
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

                  <TextField
                    name="Email"
                    label="Email"
                    type="email"
                    value={perfil.Email || ""}
                    required
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    disabled={!editMode}
                    sx={{
                      backgroundColor: editMode ? "white" : "#f8f8f8",
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
                  />

                  <Box sx={{ mx: isMobile ? 0 : -1 }}>
                    <Box
                      display="flex"
                      gap={2}
                      alignItems="center"
                      flexDirection={isMobile ? "column" : "row"}
                    >
                      <Box flex={1} width={isMobile ? "100%" : "auto"}>
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
                      <Box flex={1} width={isMobile ? "100%" : "auto"}>
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

                  {editMode && (
                    <>
                      <TextField
                        type="password"
                        label="Nova Senha (deixe vazio para não alterar)"
                        value={novaSenha}
                        onChange={handleNovaSenhaChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />

                      <TextField
                        type="password"
                        label="Confirmar Nova Senha"
                        value={confirmacaoSenha}
                        onChange={handleConfirmacaoSenhaChange}
                        error={!!errors.confirmacaoSenha}
                        helperText={errors.confirmacaoSenha}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                    </>
                  )}


                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                    flexDirection={isMobile ? "column-reverse" : "row"}
                    gap={isMobile ? 2 : 0}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={toggleEditMode}
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "&:hover": { bgcolor: "#f8f8f8" },
                        width: isMobile ? "100%" : "auto",
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
                          width: isMobile ? "100%" : "auto",
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

        {isMobile && (
          <Box display="flex" justifyContent="center" mt={4}>
            <img
              src="/icone.svg"
              alt="Logo"
              style={{
                width: "250px",
                height: "250px",
                filter:
                  "invert(16%) sepia(90%) saturate(400%) hue-rotate(-5deg)",
              }}
            />
          </Box>
        )}
      </Container>
    </AuthGuard>
  );
};

export default PerfilCliente;
