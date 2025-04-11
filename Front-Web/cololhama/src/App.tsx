import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Home/LoginPage";
import CadastroPage from "./pages/Cliente/CadastroClientePage";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme";
import "./App.css";
import NavBar from "./components/UI/NavBar";
import ClienteLogin from "./components/Login/ClienteLogin";
import PerfilCliente from "./components/Cliente/perfilCliente";
import VisualizarClientesPage from "./pages/Funcionario/VisualizarClientePage";

const App: React.FC = () => {
  const isAuthenticated = false;

  return (
    <ThemeProvider theme={theme}>  
      <CssBaseline /> 
      <NavBar isAuthenticated={isAuthenticated} />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {!isAuthenticated && (
          <>
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/perfil" element={<PerfilCliente/>} />
            <Route path="/listaClientes" element={<VisualizarClientesPage/>} />
          </>
        )}
      </Routes>
      </ThemeProvider>
  );
};

export default App;

