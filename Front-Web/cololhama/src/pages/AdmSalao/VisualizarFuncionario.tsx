import VisualizarFuncionario from "../../components/AdmSalao/VisualizarFuncionario";
import { userTypes } from "../../models/tipo-usuario.enum";
import AuthGuard from "../../utils/AuthGuard";

const VisualizarFuncionarioPage: React.FC = () => {
  return (
    <AuthGuard allowed={[userTypes.AdmSalao, userTypes.AdmSistema]}>
      <>
        <VisualizarFuncionario />;
      </>
    </AuthGuard>
  );
};
export default VisualizarFuncionarioPage;
