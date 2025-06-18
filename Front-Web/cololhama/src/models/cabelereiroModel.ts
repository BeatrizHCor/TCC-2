import { Agendamentos } from "./agendamentoModel";
import { Portfolio } from "./portifolioModel";

export interface Cabeleireiro {
    ID?: string;
    CPF: string;
    Nome: string;
    Email: string;
    Telefone: string;
    Mei?: string;
    SalaoId: string; 
    Portfolio?: Portfolio; 
    Agendamentos?: Agendamentos[];
    DataCadastro?: Date;
  }
  