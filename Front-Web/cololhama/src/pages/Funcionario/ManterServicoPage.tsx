import React from "react";
import ManterServico from "../../components/Funcionario/ManterServico";
import AuthGuard from "../../utils/AuthGuard";
import { userTypes } from "../../models/tipo-usuario.enum";

const ManterServicoPage: React.FC = () => {
  return (
    <AuthGuard
      allowed={[
        userTypes.FUNCIONARIO,
        userTypes.ADM_SALAO,
        userTypes.ADM_SISTEMA,
      ]}
    >
      <ManterServico></ManterServico>
    </AuthGuard>
  );
};

export default ManterServicoPage;
