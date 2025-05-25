import VisualizarCabeleireiro from "../../components/Cabeleireiro/VisualizarCabeleireiro";
import { userTypes } from "../../models/tipo-usuario.enum";
import AuthGuard from "../../utils/AuthGuard";

const VisualizarCabeleireiroPage: React.FC = () => {
  return (
    <AuthGuard
      allowed={[
        userTypes.FUNCIONARIO,
        userTypes.ADM_SALAO,
        userTypes.ADM_SISTEMA,
      ]}
    >
      <>
        <VisualizarCabeleireiro />;
      </>
    </AuthGuard>
  );
};
export default VisualizarCabeleireiroPage;
