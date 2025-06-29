import { AtendimentoAuxiliar } from "./atendimentoAuxiliarModel";
import { Salao } from "./salaoModel";
import { StatusCadastro } from "./status.cadastro.enum";

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
    DataCadastro?: Date;
    Status?: StatusCadastro;
  }