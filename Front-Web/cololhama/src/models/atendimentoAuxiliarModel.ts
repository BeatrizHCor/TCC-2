import { Atendimento } from "./atendimentoModal";
import { Funcionario } from "./funcionarioModel";

export interface AtendimentoAuxiliar {
  Atendimento?: Atendimento;
  AtendimentoId?: string;
  AuxiliarID: string;
  Auxiliar?: Funcionario;
}
