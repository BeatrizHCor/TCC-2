import ManterCabeleireiro from "../../components/Cabeleireiro/ManterCabelereiro";
import { userTypes } from "../../models/tipo-usuario.enum";
import AuthGuard from "../../utils/AuthGuard";
const ManterCabeleireiroPage: React.FC = () => {
  return (
    <AuthGuard
      allowed={[
        userTypes.AdmSalao,
        userTypes.AdmSistema,
        userTypes.Funcionario,
      ]}
    >
      <>
        <ManterCabeleireiro />;
      </>
    </AuthGuard>
  );
};
export default ManterCabeleireiroPage;
