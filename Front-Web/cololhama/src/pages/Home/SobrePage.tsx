import React from "react";
import {
  Box,
  Typography,
  Container,
  useTheme,
  Paper,
} from "@mui/material";
import BrushIcon from "@mui/icons-material/Brush";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";

const SobrePage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        py: 6,
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: 5,
            borderRadius: 4,
            backgroundColor: theme.palette.customColors?.lightGray,
            border: `2px solid ${theme.palette.customColors?.goldenBorder}`,
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 3,
              textAlign: "center",
              color: theme.palette.primary.main,
            }}
          >
            Sobre o Cololhama
          </Typography>

          <Typography variant="body1" sx={{ textAlign: "justify", mb: 3 }}>
            O <strong>Cololhama</strong> é um projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) do curso de 
            Tecnologia em Análise e Desenvolvimento de Sistemas da Universidade Federal do Paraná (UFPR),
            com o objetivo de enfrentar os desafios tecnológicos enfrentados por salões de beleza no Brasil,
            especialmente em relação a gestão, a baixa adoção de tecnologias digitais no setor e a falta de <strong>inovações</strong> na área.
          </Typography>

          <Typography variant="body1" sx={{ textAlign: "justify", mb: 3 }}>
            A proposta do sistema é oferecer uma plataforma de <strong>gestão para salões</strong>, que une organização, controle de serviços e um diferencial inovador: um simulador de coloração capilar com <strong>Inteligência Artificial</strong>. Essa funcionalidade permite que clientes visualizem mudanças de cor no cabelo de forma realista e prática.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <ContentCutIcon sx={{ color: theme.palette.primary.main, mt: "4px" }} />
              <Typography variant="body2" sx={{ textAlign: "justify" }}>
                O sistema também contribui para a organização dos serviços, horários e profissionais do salão, promovendo eficiência no dia a dia.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <BrushIcon sx={{ color: theme.palette.primary.main, mt: "4px" }} />
              <Typography variant="body2" sx={{ textAlign: "justify" }}>
                O simulador de coloração oferece uma experiência moderna, ajudando clientes a decidirem a cor ideal com mais segurança e satisfação.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <PsychologyAltIcon sx={{ color: theme.palette.primary.main, mt: "4px" }} />
              <Typography variant="body2" sx={{ textAlign: "justify" }}>
                A IA é aplicada para gerar resultados mais precisos e naturais, e o projeto foi desenvolvido com foco em usabilidade, acessibilidade e inovação contínua.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <EmojiEmotionsIcon sx={{ color: theme.palette.primary.main, mt: "4px" }} />
              <Typography variant="body2" sx={{ textAlign: "justify" }}>
                O Cololhama representa não apenas um sistema funcional, mas um passo em direção à <strong>modernização do setor da beleza</strong>, levando tecnologia a ambientes que ainda operam de forma manual ou limitada.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SobrePage;
