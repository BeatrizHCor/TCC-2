import "../../styles/styles.global.css";
import React from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  InputAdornment,
  IconButton,
  LinearProgress,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useClienteCadastro } from "./useCadastroCliente";
import theme from "../../styles/theme";

interface ClienteCadastroProps {}

const salaoId = import.meta.env.VITE_SALAO_ID || "1";

export const ClienteCadastro: React.FC<ClienteCadastroProps> = () => {
  const {
    cpfFormatado,
    telefoneFormatado,
    confirmacaoSenha,
    errors,
    loading,
    handleChange,
    handleCPFChange,
    handleTelefoneChange,
    handleSubmit,
    handleConfirmacaoSenhaChange,
  } = useClienteCadastro(salaoId);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
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
              filter: "invert(16%) sepia(90%) saturate(400%) hue-rotate(-5deg)",
            }}
          />
        </Box>

        <Box
          flex={1}
          display="flex"
          justifyContent="flex-start"
          sx={{ mt: 10 }}
        >
          <Paper elevation={3} sx={{ p: 5, width: 520 }}>
            {loading && <LinearProgress />}

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ color: theme.palette.primary.main }}
            >
              Cadastre-se
            </Typography>

            <Typography
              variant="body1"
              color="textSecondary"
              component="p"
              sx={{ marginBottom: "16px" }}
            >
              Preencha os campos abaixo
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Stack spacing={2}>
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Informações Pessoais
                </Typography>

                <TextField
                  name="nome"
                  label="Nome Completo"
                  required
                  onChange={handleChange}
                  error={!!errors.nome}
                  helperText={errors.nome}
                  fullWidth
                />

                <Box sx={{ mx: -1 }}>
                  <Box display="flex" gap={2} alignItems="center">
                    <Box flex={1}>
                      <TextField
                        label="CPF"
                        required
                        value={cpfFormatado}
                        onChange={handleCPFChange}
                        error={!!errors.CPF}
                        helperText={errors.CPF}
                        fullWidth
                        slotProps={{
                          input: { sx: { maxLength: 14 } },
                        }}
                      />
                    </Box>
                    <Box flex={1}>
                      <TextField
                        label="Telefone"
                        required
                        value={telefoneFormatado}
                        onChange={handleTelefoneChange}
                        error={!!errors.telefone}
                        helperText={errors.telefone}
                        fullWidth
                        slotProps={{
                          input: { sx: { maxLength: 15 } },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <TextField
                  name="email"
                  label="Email"
                  required
                  type="email"
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                />

                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.primary.main, mt: 2 }}
                >
                  Senha
                </Typography>

                <Box sx={{ mx: -1 }}>
                  <Box display="flex" gap={2} alignItems="center">
                    <Box flex={1}>
                      <TextField
                        name="password"
                        label="Senha"
                        required
                        type={showPassword ? "text" : "password"}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box flex={1}>
                      <TextField
                        label="Confirmar Senha"
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmacaoSenha}
                        onChange={handleConfirmacaoSenhaChange}
                        error={!!errors.confirmacaoSenha}
                        helperText={errors.confirmacaoSenha}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowConfirmPassword}
                                edge="end"
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  A senha deve conter pelo menos 8 caracteres, incluindo letras
                  maiúsculas, minúsculas, números e caracteres especiais.
                </Alert>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={3}
                >
                  <MuiLink component={Link} to="/login" variant="body2">
                    Já possui uma conta? Faça login
                  </MuiLink>

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
                    {loading ? "Cadastrando..." : "CADASTRAR"}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default ClienteCadastro;
