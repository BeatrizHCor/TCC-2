import "../../styles/styles.global.css";
import React, { useContext } from "react";
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
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useClienteCadastro } from "./useCadastroCliente";
import theme from "../../styles/theme";
import { AuthContext } from "../../contexts/AuthContext";

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

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { checkLocalStorage } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCadastroandLogin = (e: React.FormEvent) => {
    handleSubmit(e)
      .then((e) => {
        checkLocalStorage();
        return navigate("/");
      })
      .catch((er) => {
        return;
      });
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="lg" sx={{ px: 2 }}>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        py={4}
        gap={isMobile ? 4 : 0}
      >
        {/* Imagem */}
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={isMobile ? 0 : 10}
        >
          <img
            src="/icone.svg"
            alt="Logo"
            style={{
              width: isMobile ? "180px" : "400px",
              height: isMobile ? "180px" : "400px",
              filter: "invert(16%) sepia(90%) saturate(400%) hue-rotate(-5deg)",
            }}
          />
        </Box>

        {/* Formulário */}
        <Box flex={1} display="flex" justifyContent="center">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 4,
              width: "100%",
              maxWidth: 520,
              bgcolor: "#fff",
            }}
          >
            {loading && <LinearProgress />}

            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              sx={{ color: theme.palette.primary.main }}
            >
              Cadastre-se
            </Typography>

            <Typography variant="body1" color="textSecondary" paragraph>
              Preencha os campos abaixo
            </Typography>

            <Box
              component="form"
              onSubmit={handleCadastroandLogin}
              noValidate
              sx={{ mt: 1 }}
            >
              <Stack spacing={2}>
                <TextField
                  name="nome"
                  label="Nome Completo"
                  required
                  onChange={handleChange}
                  error={!!errors.nome}
                  helperText={errors.nome}
                  fullWidth
                />

                <Box
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  gap={2}
                >
                  <TextField
                    label="CPF"
                    required
                    value={cpfFormatado}
                    onChange={handleCPFChange}
                    error={!!errors.CPF}
                    helperText={errors.CPF}
                    fullWidth
                  />
                  <TextField
                    label="Telefone"
                    required
                    value={telefoneFormatado}
                    onChange={handleTelefoneChange}
                    error={!!errors.telefone}
                    helperText={errors.telefone}
                    fullWidth
                  />
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

                <Box
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  gap={2}
                >
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
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
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
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
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

                <Alert severity="info" sx={{ mt: 1 }}>
                  A senha deve conter pelo menos 8 caracteres, incluindo letras
                  maiúsculas, minúsculas, números e caracteres especiais.
                </Alert>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection={isMobile ? "column" : "row"}
                  gap={2}
                  mt={2}
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
                      width: isMobile ? "100%" : "auto",
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
