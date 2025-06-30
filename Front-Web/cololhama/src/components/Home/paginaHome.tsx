import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Paper,
  useTheme,
} from "@mui/material";
import ArrowRight from "@mui/icons-material/ArrowRight";
import {
  Scissors,
  Palette,
  Smile,
  Sparkles,
  User,
  Star,
} from "lucide-react";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import BrushIcon from "@mui/icons-material/Brush";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useNavigate } from "react-router-dom";
import { useVisualizarServicos } from "../../components/Funcionario/useVisualizarServicos";
import { useVisualizarCabeleireiros } from "../Cabeleireiro/useVisualizarCabeleireiro";

export default function PaginaHome() {
  const theme = useTheme();
  const nav = useNavigate();
  const salaoId = import.meta.env.VITE_SALAO_ID;

  const { servicos, isLoading } = useVisualizarServicos(1, 10, salaoId);
  const { cabeleireiros, isLoading: loadingC } = useVisualizarCabeleireiros(1, 10, salaoId, "", undefined);

  return (
    <Box sx={{ backgroundColor: "#fafafa" }}>
      <Box
        sx={{
          background: `linear-gradient(135deg, #fff7f9 0%, #fafafa 100%)`,
          overflow: "hidden",
          mb: 2,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            py: 4,
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: 2,
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="Cololhama"
                sx={{ width: 80, height: 80, objectFit: "contain" }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.primary.main,
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: 1.1,
                }}
              >
                Cololhama
              </Typography>
            </Box>

            <Typography
              variant="h5"
              sx={{
                mt: 3,
                color: theme.palette.text.secondary,
                maxWidth: 500,
                fontFamily: "Poppins, sans-serif",
                mx: { xs: "auto", md: 0 },
                lineHeight: 1.6,
              }}
            >
              Sua beleza é nossa arte. Descubra um novo visual com profissionais que entendem você.
            </Typography>

            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowRight />}
              onClick={() => nav("/agendamentos")}
              sx={{
                mt: 4,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 8,
                px: 5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
            >
              Agendar Consulta
            </Button>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/icone.svg"
              alt="Ilustração"
              sx={{
                width: 280,
                height: 280,
                objectFit: "contain",
                color: theme.palette.primary.main,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* SERVIÇOS + SOBRE NÓS */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: "#fff",
              border: `2px solid ${theme.palette.customColors?.goldenBorder}`,
            }}
          >
            <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
              Serviços em Destaque
            </Typography>

            {isLoading ? (
              <Box textAlign="center"><CircularProgress /></Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px,1fr))",
                  gap: 2,
                  mt: 2,
                }}
              >
                {servicos.slice(0, 4).map((s) => (
                  <Paper
                    key={s.ID}
                    elevation={1}
                    sx={{
                      textAlign: "center",
                      p: 2,
                      borderRadius: 3,
                      transition: "0.3s",
                      backgroundColor: "#fff",
                      "&:hover": {
                        transform: "scale(1.05)",
                        backgroundColor: theme.palette.customColors?.softPink || "#fdecef",
                      },
                    }}
                  >
                    {
                      s.Nome.toLowerCase().includes("corte") ? <Scissors size={28} />
                        : s.Nome.toLowerCase().includes("coloração") ? <Palette size={28} />
                          : s.Nome.toLowerCase().includes("hidratação") ? <Smile size={28} />
                            : <Sparkles size={28} />
                    }
                    <Typography variant="body2" mt={1} fontWeight={600}>
                      {s.Nome}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}

            <Box textAlign="center" mt={3}>
              <Button
                onClick={() => nav("/servicos")}
                endIcon={<ArrowRight />}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  borderRadius: 10,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Ver mais serviços
              </Button>
            </Box>
          </Paper>

          {/* Sobre Nós */}
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: "#fff",
              border: `2px solid ${theme.palette.customColors?.goldenBorder}`,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              textAlign="center"
              sx={{ color: theme.palette.primary.main }}
              gutterBottom
            >
              <EmojiEmotionsIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Sobre Nós
            </Typography>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <ContentCutIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="body2" color="text.secondary">
                Cortes modernos e atendimento personalizado para realçar sua beleza.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <BrushIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="body2" color="text.secondary">
                Produtos profissionais e técnicas atualizadas com carinho.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Star size={22} color={theme.palette.primary.main} />
              <Typography variant="body2" color="text.secondary">
                Comprometidos com sua satisfação e autoestima.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* CABELEIREIROS */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: "#fff",
            border: `2px solid ${theme.palette.customColors?.goldenBorder}`,
          }}
        >
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
            Nossos Profissionais
          </Typography>

          {loadingC ? (
            <Box textAlign="center"><CircularProgress /></Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 3,
              }}
            >
              {cabeleireiros.slice(0, 4).map((c) => (
                <Paper
                  key={c.ID}
                  elevation={1}
                  onClick={() => nav(`/portfolio/${c.ID}`)}
                  sx={{
                    cursor: "pointer",
                    textAlign: "center",
                    p: 2,
                    borderRadius: 3,
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor: theme.palette.customColors?.softPink || "#fdecef",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <User size={36} color={theme.palette.primary.main} />
                  <Typography variant="body1" fontWeight={600} mt={1}>
                    {c.Nome}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}

          <Box textAlign="center" mt={4}>
            <Button
              onClick={() => nav("/cabeleireiros")}
              endIcon={<ArrowRight />}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                borderRadius: 10,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Ver mais cabeleireiros
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
