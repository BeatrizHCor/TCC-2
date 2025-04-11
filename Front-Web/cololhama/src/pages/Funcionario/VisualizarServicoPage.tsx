import react from "react";
import { VisualizarServicos } from "../../components/Funcionario/VisualizarServicos";

const VisualizarServicoPage: React.FC = () => {
  return (
    <div>
      <VisualizarServicos isAdmin={true} salaoId={"1"} />
    </div>
  );
}
export default VisualizarServicoPage; 