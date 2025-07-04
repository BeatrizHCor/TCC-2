import React from "react";
import { VisualizarClientes } from "../../components/Funcionario/VisualizarClientes";
import AuthGuard from "../../utils/AuthGuard";
import { userTypes } from "../../models/tipo-usuario.enum";

const VisualizarClientesPage: React.FC = () => {
  return (
    <AuthGuard
      allowed={[
        userTypes.Funcionario,
        userTypes.AdmSalao,
        userTypes.AdmSistema,
      ]}
    >
      <VisualizarClientes />
    </AuthGuard>
  );
};

export default VisualizarClientesPage;
