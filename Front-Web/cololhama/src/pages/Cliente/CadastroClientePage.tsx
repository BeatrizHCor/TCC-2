import React from "react";
import CadastroCliente from "../../components/Cliente/CadastroCliente";

const CadastroPage: React.FC = () => {
  return (
    <div className="cadastro-page">
      < CadastroCliente salaoId={""} />
    </div>
  );
};

export default CadastroPage;
