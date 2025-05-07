import { AtendimentoAuxiliar } from "./atendimentoAuxiliarModel";
import { Atendimento } from "./atendimentoModal";
import { Holerite } from "./holeriteModel";

export interface Funcionario {
  ID?: string;
  CPF: string;
  Nome: string;
  Email: string;
  Telefone: string;
  SalaoId: string; 
  Auxiliar: boolean;
  Salario?: number;
  atendimentos?: Atendimento[];
  AtendimentoAuxiliar?: AtendimentoAuxiliar[];
  Holerite?: Holerite[];
  DataCadastro?: Date;
}