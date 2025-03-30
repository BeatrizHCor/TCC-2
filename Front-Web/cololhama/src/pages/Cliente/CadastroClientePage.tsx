import React from "react";
import CadastroCliente from "../../components/Cliente/CadastroCliente";

const CadastroPage: React.FC = () => {
  return (
    <div className="cadastro-page">
      <h1>Cadastro de Cliente</h1>
      <CadastroCliente />
    </div>
  );
};

export default CadastroPage;
