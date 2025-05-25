import ManterFuncionario from "../../components/AdmSalao/ManterFuncionario";
import { userTypes } from "../../models/tipo-usuario.enum";
import AuthGuard from "../../utils/AuthGuard";

const ManterFuncionarioPage: React.FC = () => {
  return (
    <AuthGuard allowed={[userTypes.ADM_SALAO, userTypes.ADM_SISTEMA]}>
      <>
        <ManterFuncionario />;
      </>
    </AuthGuard>
  );
};

export default ManterFuncionarioPage;
