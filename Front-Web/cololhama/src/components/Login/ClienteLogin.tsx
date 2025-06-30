import "../../styles/styles.global.css";
import React, { useContext, useEffect, useState } from "react";
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
import theme from "../../styles/theme";
import { AuthContext } from "../../contexts/AuthContext";
import { userTypes } from "../../models/tipo-usuario.enum";

export const ClienteLogin: React.FC = () => {
  const navigate = useNavigate();
  const { doLogin, userType } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
    if (!email || !senha) {
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Formato de email inválido");
      return;
    }

    setLoading(true);
    setError(null);

    await doLogin(email, senha).then((e) => {
      setLoading(false);
      if (userType) {
        navigate("/");
      } else {
        setError("Email ou senha inválidos. Tente novamente.");
      }
    });
  };

  useEffect(() => {
    if (userType) {
      navigate("/");
    }
  }, [userType]);

  const isLoginDisabled = !validateEmail(email) || senha.trim() === "";

  return (
    <Container maxWidth="lg" sx={{ px: isMobile ? 2 : 3 }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={isMobile ? "auto" : "90vh"}
        py={isMobile ? 4 : 0}
      >
        <Box
          display="flex"
          flexDirection={isMobile ? "column-reverse" : "row"}
          gap={isMobile ? 4 : 2}
          alignItems="center"
          width="100%"
        >

          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            width="100%"
            order={1}
          >
            <Paper
              elevation={3}
              sx={{
                p: isMobile ? 3 : 5,
                width: "100%",
                maxWidth: 400
              }}
            >
              {loading && <LinearProgress />}

              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                gutterBottom
                sx={{ color: theme.palette.primary.main }}
              >
                Login
              </Typography>

              <Typography variant="body1" color="textSecondary" paragraph>
                Acesse sua conta
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

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
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection={isMobile ? "column" : "row"}
                    gap={isMobile ? 2 : 0}
                  >
                    <MuiLink
                      component={Link}
                      to="/cadastro"
                      variant="body2"
                      sx={{ mb: isMobile ? 1 : 0 }}
                    >
                      Não tem uma conta? Cadastre-se
                    </MuiLink>

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: isLoginDisabled
                          ? "#ccc"
                          : theme.palette.primary.main,
                        color: isLoginDisabled ? "#000" : "#fff",
                        "&:hover": {
                          bgcolor: isLoginDisabled ? "#ccc" : "#600000",
                        },
                        width: isMobile ? "100%" : "auto",
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

          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            order={2}
          >
            <img
              src="/icone.svg"
              alt="Logo"
              style={{
                width: isMobile ? "250px" : "450px",
                height: isMobile ? "250px" : "450px",
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