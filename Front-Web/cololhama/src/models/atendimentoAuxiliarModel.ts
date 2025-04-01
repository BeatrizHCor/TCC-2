import { Atendimento } from "./atendimentoModal";
import { Funcionario } from "./funcionarioModel";

export interface AtendimentoAuxiliar {
    atendimento: Atendimento; 
    atendimentoId: string; 
    auxiliarID: string;
    salaoId: string;
    auxiliar: Funcionario;
  }