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
import PerfilCliente from "./components/Cliente/perfilCliente";
import VisualizarClientesPage from "./pages/Funcionario/VisualizarClientePage";
import VisualizarServicoPage from "./pages/Funcionario/VisualizarServicoPage";
import EditarServicoPage from "./pages/Funcionario/EditarServicoPage";
import NovoServicoPage from "./pages/Funcionario/NovoServicePage";
import VisualizarCabeleireiroPage from "./pages/Cabeleireiro/VisualizarCabeleireiroPage";
import VisualizarFuncionarioPage from "./pages/AdmSalao/VisualizarFuncionario";
import ManterCabeleireiroPage from "./pages/Cabeleireiro/ManterCabelereiroPage";

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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/perfil" element={<PerfilCliente />} />
            <Route path="/listaClientes" element={<VisualizarClientesPage />} />
            <Route path="/servicos" element={<VisualizarServicoPage />} />
            <Route path="/servico/editar/novo" element={<NovoServicoPage/>} />
            <Route path="/servico/editar/:servicoId" element={<EditarServicoPage/>} />
            <Route
              path="/cabeleireiros"
              element={<VisualizarCabeleireiroPage />}
            />
            <Route path="/cabeleireiro/editar/:cabeleireiroId" element={<ManterCabeleireiroPage/>}/>
            <Route path="/cabeleireiro/novo" element={<ManterCabeleireiroPage/>}/>
            
            <Route path ="/funcionarios" element={<VisualizarFuncionarioPage />} />
          </>
        )}
      </Routes>
    </ThemeProvider>
  );
};

export default App;
