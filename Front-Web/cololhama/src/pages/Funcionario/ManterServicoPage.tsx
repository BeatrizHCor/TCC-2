import React from "react";
import ManterServico from "../../components/Funcionario/ManterServico";
import AuthGuard from "../../utils/AuthGuard";
import { userTypes } from "../../models/tipo-usuario.enum";

const ManterServicoPage: React.FC = () => {
  return (
    <AuthGuard
      allowed={[
        userTypes.Funcionario,
        userTypes.AdmSalao,
        userTypes.AdmSistema,
      ]}
    >
      <ManterServico></ManterServico>
    </AuthGuard>
  );
};

export default ManterServicoPage;
