import { AtendimentoAuxiliar } from "./atendimentoAuxiliarModel";
import { Holerite } from "./holeriteModel";
import { Salao } from "./salaoModel";

export interface Funcionario {
    ID?: string;
    CPF: string;
    Nome: string;
    Email: string;
    Telefone: string;
    Salao?: Salao;
    SalaoId: string;
    Auxiliar: boolean;
    Salario?: number;
    AtendimentoAuxiliar?: AtendimentoAuxiliar[];
    Holerite?: Holerite[];
    DataCadastro?: Date;
  }