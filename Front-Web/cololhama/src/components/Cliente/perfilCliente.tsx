import "../../styles/styles.global.css";
import React, { useState, useEffect } from "react";
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useClienteCadastro } from "./useCadastroCliente";
import theme from "../../styles/theme";

interface PerfilClienteProps {}
const salaoId = "1";
export const PerfilCliente: React.FC<PerfilClienteProps> = () => {

  const {
    cliente,
    auth,
    cpfFormatado,
    telefoneFormatado,
    confirmacaoSenha,
    errors,
    loading,
    saveSuccess,
    setSaveSuccess,
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
  } = useClienteCadastro(salaoId ? salaoId : "");

  const [editMode, setEditMode] = useState(false);
  const [clienteBackup, setClienteBackup] = useState({ ...cliente });
  const [authBackup, setAuthBackup] = useState({ ...auth });
  const [telefoneFormatadoBackup, setTelefoneFormatadoBackup] = useState(telefoneFormatado);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    if (saveSuccess) {
      setShowSuccessAnimation(true);
      
      const timer = setTimeout(() => {
        setShowSuccessAnimation(false);
        setSaveSuccess(false);
        setEditMode(false);
        
        setClienteBackup({ ...cliente });
        setAuthBackup({ ...auth });
        setTelefoneFormatadoBackup(telefoneFormatado);
      }, 1500); 
      
      return () => clearTimeout(timer);
    }
  }, [saveSuccess, cliente, auth, telefoneFormatado]);

  const toggleEditMode = () => {
    if (editMode) {
      setCliente({ ...clienteBackup });
      setAuth({ ...authBackup });
      setConfirmacaoSenha("");
      setErrors({});
    } else {

      setClienteBackup({ ...cliente });
      setAuthBackup({ ...auth });
      setTelefoneFormatadoBackup(telefoneFormatado);
    }
    setEditMode(!editMode);
  };


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    await handleSubmit(e);
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="center" alignItems="center" height="90vh">
        <Box flex={1} display="flex" justifyContent="center">
          <img src="/icone.svg" alt="Logo" style={{ width: "450px", height: "450px", filter: "invert(16%) sepia(90%) saturate(400%) hue-rotate(-5deg)" }} />
        </Box>

        <Box flex={1} display="flex" justifyContent="flex-start">
          <Paper elevation={3} sx={{ p: 5, width: 520, position: 'relative' }}>
            {showSuccessAnimation && (
              <Fade in={showSuccessAnimation}>
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
                  <CheckCircleIcon sx={{ fontSize: 80, color: 'green' }} />
                  <Typography variant="h6" sx={{ mt: 2, color: 'green' }}>
                    Perfil salvo com sucesso!
                  </Typography>
                </Box>
              </Fade>
            )}
            
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.primary.main }}>
              {editMode ? "Editar Perfil" : "Seu Perfil"}
            </Typography>

            <Box component="form" onSubmit={handleFormSubmit} noValidate>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                  Informações Pessoais
                </Typography>

                <TextField
                  name="Nome"
                  label="Nome Completo"
                  value={editMode ? cliente.nome || "" : ""}
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
                    }
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
                          }
                        }} 
                      />
                    </Box>
                    <Box flex={1}>
                      <TextField
                        label="Telefone"
                        value={editMode ? telefoneFormatado || "" : telefoneFormatadoBackup || ""}
                        onChange={handleTelefoneChange}
                        error={!!errors.telefone}
                        helperText={errors.telefone}
                        inputProps={{ maxLength: 15 }}
                        fullWidth
                        disabled={!editMode}
                        sx={{ 
                          backgroundColor: editMode ? "white" : "#f8f8f8",
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <TextField
                  name="email"
                  label="Email"
                  value={editMode ? auth.email || "" : authBackup.email || ""}
                  required
                  type="email"
                  onChange={handleAuthChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  disabled={!editMode}
                  sx={{ 
                    backgroundColor: editMode ? "white" : "#f8f8f8",
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                    }
                  }}
                />

                <Typography variant="h6" sx={{ color: theme.palette.primary.main, mt: 2 }}>
                  Senha
                </Typography>

                <TextField
                  name="senha"
                  label="Senha"
                  type="password"
                  value={editMode ? auth.senha || "" : "••••••••"}
                  required
                  onChange={handleAuthChange}
                  error={!!errors.senha}
                  helperText={errors.senha}
                  fullWidth
                  disabled={!editMode}
                  sx={{ 
                    backgroundColor: editMode ? "white" : "#f8f8f8",
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                    }
                  }}
                />

                {editMode && (
                  <TextField
                    label="Confirmar Senha"
                    required
                    type="password"
                    value={confirmacaoSenha || ""}
                    onChange={handleConfirmacaoSenhaChange}
                    error={!!errors.confirmacaoSenha}
                    helperText={errors.confirmacaoSenha}
                    fullWidth
                  />
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                  <Button variant="outlined" size="large" onClick={toggleEditMode} sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main, "&:hover": { bgcolor: "#f8f8f8" } }} disabled={loading}>
                    {editMode ? "Cancelar" : "Editar Perfil"}
                  </Button>

                  {editMode && (
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large" 
                      startIcon={loading && <CircularProgress size={20} color="inherit" />}
                      sx={{ bgcolor: theme.palette.primary.main, color: "#fff", "&:hover": { bgcolor: "#600000" } }} 
                      disabled={loading || showSuccessAnimation}
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