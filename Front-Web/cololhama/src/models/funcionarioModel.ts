import { AtendimentoAuxiliar } from "./atendimentoAuxiliarModel";
import { Atendimento } from "./atendimentoModal";
import { Holerite } from "./holeriteModel";

export interface Funcionario {
    id?: string;
    cpf: string;
    nome: string;
    email: string;
    telefone: string;
    salaoId: string; 
    auxiliar: boolean;
    salario?: number;
    atendimentos?: Atendimento[];
    atendimentoAuxiliar?: AtendimentoAuxiliar[];
    holerite?: Holerite[];
  }