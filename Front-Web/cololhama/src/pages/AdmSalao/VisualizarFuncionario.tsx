import VisualizarFuncionario from "../../components/AdmSalao/VisualizarFuncionario";
import { userTypes } from "../../models/tipo-usuario.enum";
import AuthGuard from "../../utils/AuthGuard";

const VisualizarFuncionarioPage: React.FC = () => {
  return (
    <AuthGuard
      allowed={[
        userTypes.FUNCIONARIO,
        userTypes.ADM_SALAO,
        userTypes.ADM_SISTEMA,
      ]}
    >
      <>
        <VisualizarFuncionario />;
      </>
    </AuthGuard>
  );
};
export default VisualizarFuncionarioPage;
