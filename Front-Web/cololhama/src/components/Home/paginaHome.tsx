import { Container, Typography, Button, Paper} from "@mui/material";
import "../../styles/styles.global.css";
import React from 'react';
import { Link } from "react-router-dom";

const PaginaHome: React.FC = () => {
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
              
              <Button variant="contained" component={Link} to="/login" sx={{ mt: 2, color: "primary" }}>
               Login
              </Button>
              <Button variant="contained" component={Link} to="/cadastro" sx={{ mt: 2, color: "primary" }}>
                Cadastro
              </Button>
            </Paper>
          </Container>
        </>
      );
    }

export default PaginaHome;