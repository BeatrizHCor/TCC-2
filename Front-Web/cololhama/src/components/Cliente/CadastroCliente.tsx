import React from "react";
import { Container, Typography, Button, Paper } from "@mui/material";
import "../../styles/styles.global.css";

export const CadastroCliente: React.FC = () => {
  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Bem-vindo
          </Typography>
          <Typography variant="body1">
            Este é um exemplo de estrutura básica de uma página em React com TypeScript e Material-UI.
          </Typography>
      
        </Paper>
      </Container>
    </>
  );
};
export default CadastroCliente;
