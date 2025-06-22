import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  CircularProgress,
  useTheme,
} from "@mui/material";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import BrushIcon from "@mui/icons-material/Brush";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useVisualizarServicos } from "../../components/Funcionario/useVisualizarServicos";
import { useVisualizarCabeleireiros } from "../Cabeleireiro/useVisualizarCabeleireiro";


const PaginaHome: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const salaoId = import.meta.env.VITE_SALAO_ID;
  const { servicos, isLoading } = useVisualizarServicos(1, 10, salaoId);
  const {
    cabeleireiros,
    isLoading: isLoadingCabeleireiros,
    error: errorCabeleireiros
  } = useVisualizarCabeleireiros(1, 4, salaoId, "", undefined);


  const sugestoes = ["Corte feminino", "Coloração", "Hidratação", "Barbearia"];



  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        py: 6,
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ px: 2 }}>
        <Box
          sx={{
            mb: 6,
            textAlign: "center",
            backgroundColor: theme.palette.customColors?.lightGray,
            borderRadius: 4,
            p: 4,
            border: `2px solid ${theme.palette.customColors?.goldenBorder}`,
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
          >
            Bem-vindo ao Salão Cololhama
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: theme.palette.text.secondary, mt: 1 }}
          >
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
          {/* Serviços em Destaque */}
          <Box
            sx={{
              flex: "1 1 300px",
              backgroundColor: theme.palette.customColors?.lightGray,
              borderRadius: 4,
              p: 3,
              border: `2px solid ${theme.palette.customColors?.goldenBorder}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Serviços em Destaque
            </Typography>

            {isLoading ? (
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
                      backgroundColor: "#fff",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.customColors?.softPink || "#fdecef",
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
                mt: 1,
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                borderRadius: 10,
                fontWeight: 600,
                textTransform: "none",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  transform: "scale(1.02)",
                },
              }}
            >
              Ver mais serviços
            </Button>
          </Box>

          {/* Cabeleireiros */}
          <Box
            sx={{
              flex: "1 1 300px",
              backgroundColor: theme.palette.customColors?.lightGray,
              borderRadius: 4,
              p: 3,
              border: `2px solid ${theme.palette.customColors?.goldenBorder}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Conheça nossos Cabeleireiros
            </Typography>

            {isLoadingCabeleireiros ? (
              <CircularProgress />
            ) : (
              <Paper
                elevation={4}
                sx={{
                  borderRadius: 4,
                  p: 2,
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {cabeleireiros.slice(0, 4).map((cabel) => (
                  <Button
                    key={cabel.ID}
                    fullWidth
                    onClick={() => navigate(`/portfolio/${cabel.ID}`)}
                    sx={{
                      justifyContent: "space-between",
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 500,
                      border: `1px solid ${theme.palette.primary.main}`,
                      color: theme.palette.primary.main,
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.customColors?.softPink || "#fdecef",
                        borderColor: theme.palette.primary.dark,
                      },
                    }}
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                  >
                    {cabel.Nome}
                  </Button>
                ))}
              </Paper>
            )}
          </Box>


          {/* Sobre Nós */}
          <Box
            sx={{
              flex: "1 1 300px",
              backgroundColor: theme.palette.customColors?.lightGray,
              borderRadius: 4,
              p: 4,
              border: `2px solid ${theme.palette.customColors?.goldenBorder}`,
              boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <EmojiEmotionsIcon sx={{ color: theme.palette.primary.main }} />
              Sobre nós
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <ContentCutIcon sx={{ color: theme.palette.primary.main, mt: "4px" }} />
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "justify",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Transformamos visual com talento e cuidado. Seu estilo é nossa
                  prioridade.
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <BrushIcon sx={{ color: theme.palette.primary.main, mt: "4px" }} />
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "justify",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Produtos de qualidade e equipe apaixonada para realçar sua beleza.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PaginaHome;
