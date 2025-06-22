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
import VisualizarCabeleireiroPage from "./pages/Cabeleireiro/VisualizarCabeleireiroPage";
import VisualizarFuncionarioPage from "./pages/AdmSalao/VisualizarFuncionario";
import ManterCabeleireiroPage from "./pages/Cabeleireiro/ManterCabelereiroPage";
import PortfolioPage from "./components/Cabeleireiro/PortfolioPage";
import ManterFuncionarioPage from "./pages/AdmSalao/ManterFuncionario";
import ManterServicoPage from "./pages/Funcionario/ManterServicoPage";
import VisualizarAgendamentoPage from "./pages/Funcionario/VisulaizarAgendamentoPage";
import { AuthContextProvider } from "./contexts/AuthContext";
import VisualizarAtendimentoPage from "./pages/Funcionario/VisualizarAtendimento";
import ManterAgendamentoPage from "./pages/Funcionario/ManterAgendamentoPage";
import ManterAtendimento from "./components/Funcionario/ManterAtendimento";
import SimulacaoPage from "./pages/IA/SimulacaoPage";

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/perfil" element={<PerfilCliente />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/listaClientes" element={<VisualizarClientesPage />} />
          <Route path="/servicos" element={<VisualizarServicoPage />} />
          <Route path="/servico/editar/novo" element={<ManterServicoPage />} />
          <Route
            path="/servico/editar/:servicoId"
            element={<ManterServicoPage />}
          />
          <Route
            path="/portfolio/:cabeleireiroId"
            element={<PortfolioPage />}
          />
          <Route
            path="/cabeleireiros"
            element={<VisualizarCabeleireiroPage />}
          />
          <Route
            path="/cabeleireiro/novo"
            element={<ManterCabeleireiroPage />}
          />
          <Route
            path="/cabeleireiro/editar/:cabeleireiroId"
            element={<ManterCabeleireiroPage />}
          />
          <Route path="/funcionarios" element={<VisualizarFuncionarioPage />} />
          <Route path="/funcionario/novo" element={<ManterFuncionarioPage />} />
          <Route
            path="/funcionario/editar/:funcionarioId"
            element={<ManterFuncionarioPage />}
          />
          <Route path="/agendamentos" element={<VisualizarAgendamentoPage />} />
          <Route
            path="/agendamento/editar/:agendamentoId"
            element={<ManterAgendamentoPage />}
          />{" "}
          <Route path="/agendamento/novo" element={<ManterAgendamentoPage />} />
          <Route
            path="/atendimento/editar/:atendimentoId"
            element={<ManterAtendimento />}
          />{" "}
          <Route path="/atendimento/novo" element={<ManterAtendimento />} />
          <Route path="/atendimentos" element={<VisualizarAtendimentoPage />} />

          <Route path="/simulacao" element={<SimulacaoPage/>}/>
        </Routes>
      </ThemeProvider>
    </AuthContextProvider>
  );
};

export default App;
