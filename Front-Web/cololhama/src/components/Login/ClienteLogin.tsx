import "../../styles/styles.global.css";
import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { LoginService } from "../../services/LoginService";
import theme from "../../styles/theme";

export const ClienteLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError("Formato de email inválido");
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Formato de email inválido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await LoginService.login(email, senha, "salaoId");
      navigate("/dashboard");
    } catch (err) {
      setError("Email ou senha inválidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const isLoginDisabled = !validateEmail(email) || senha.trim() === "";

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="center" alignItems="center" height="90vh">
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} alignItems="center" width="100%">
          <Box flex={1} display="flex" justifyContent="center">
            <Paper elevation={3} sx={{ p: 5, width: "100%", maxWidth: 400 }}>
              {loading && <LinearProgress />}

              <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Login
              </Typography>

              <Typography variant="body1" color="textSecondary" paragraph>
                Acesse sua conta
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                  <TextField
                    name="email"
                    label="Email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    error={!!emailError}
                    helperText={emailError}
                    fullWidth
                  />

                  <TextField
                    name="senha"
                    label="Senha"
                    required
                    type={showPassword ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <MuiLink component={Link} to="/cadastro" variant="body2">
                      Não tem uma conta? Cadastre-se
                    </MuiLink>

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: isLoginDisabled ? "#ccc" : theme.palette.primary.main,
                        color: isLoginDisabled ? "#000" : "#fff",
                        "&:hover": { bgcolor: isLoginDisabled ? "#ccc" : "#600000" },
                      }}
                      disabled={isLoginDisabled || loading}
                    >
                      {loading ? "Entrando..." : "LOGIN"}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Box>

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
        </Box>
      </Box>
    </Container>
  );
};

export default ClienteLogin;