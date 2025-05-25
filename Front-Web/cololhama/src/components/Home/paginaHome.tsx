import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import ServicoService from "../../services/ServicoService";
import { Servico } from "../../models/servicoModel";

const PaginaHome: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  const salaoId = import.meta.env.VITE_SALAO_ID;

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await ServicoService.getServicosBySalao(salaoId);
        setServicos(response);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicos();
  }, [salaoId]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fdf6f0", py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
          >
            Bem-vindo ao seu Salão Favorito
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#555", mt: 1 }}>
            Descubra nossos serviços especiais e transforme seu visual
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flex: "1 1 300px" }}>
            <Typography variant="h6" gutterBottom>
              Serviços em Destaque
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                {servicos.slice(0, 4).map((servico, idx) => (
                  <Paper
                    key={idx}
                    elevation={4}
                    sx={{
                      borderRadius: 4,
                      width: 130,
                      height: 100,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      p: 1,
                      backgroundColor: "#fffefb",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor: "#f5e8da",
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight="600">
                      {servico.Nome}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}

            <Button
              fullWidth
              onClick={() => navigate("/servicos")}
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                borderRadius: 10,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Ver mais serviços
            </Button>
          </Box>

          <Box sx={{ flex: "1 1 300px" }}>
            <Typography variant="h6" gutterBottom>
              Buscar Serviços
            </Typography>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 4,
                p: 2,
                backgroundColor: "#fffefb",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {["Corte feminino", "Coloração", "Hidratação", "Barbearia"].map(
                (item, index) => (
                  <TextField
                    key={index}
                    variant="outlined"
                    size="small"
                    value={item}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ borderRadius: 2 }}
                  />
                )
              )}
              <TextField
                placeholder="Buscar serviços..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Paper>
          </Box>

          <Box sx={{ flex: "1 1 300px" }}>
            <Typography variant="h6" gutterBottom>
              Destaques do Salão
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                {
                  title: "Coloração Premium",
                  desc: "Mechas, luzes e tintura com os melhores produtos.",
                },
                {
                  title: "Corte Personalizado",
                  desc: "Deixe seu estilo em alta com nossos especialistas.",
                },
                {
                  title: "Spa Capilar Deluxe",
                  desc: "Hidratação profunda com essências naturais.",
                },
              ].map((info, idx) => (
                <Paper
                  key={idx}
                  elevation={3}
                  sx={{
                    borderRadius: 4,
                    p: 2,
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
                    {info.title[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {info.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {info.desc}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Sobre nós
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: 700, mx: "auto", color: "#666" }}
          >
            No nosso salão, a beleza encontra a arte. Com uma equipe dedicada e
            produtos de alta qualidade, garantimos que cada cliente saia
            renovado e feliz. Seu estilo, sua essência, nosso cuidado.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PaginaHome;
