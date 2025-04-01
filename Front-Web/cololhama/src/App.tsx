import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Home/LoginPage";
import CadastroPage from "./pages/Cliente/CadastroClientePage";

import "./App.css";
import NavBar from "./components/UI/Navbar";

const App: React.FC = () => {
  const isAuthenticated = false;

  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {!isAuthenticated && (
          <>
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/login" element={<LoginPage />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;

