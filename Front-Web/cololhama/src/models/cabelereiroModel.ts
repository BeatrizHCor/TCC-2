import { Agendamentos } from "./agendamentoModel";
import { Holerite } from "./holeriteModel";
import { Portfolio } from "./portifolioModel";

export interface Cabeleireiro {
    ID?: string;
    CPF: string;
    Nome: string;
    Email: string;
    Telefone: string;
    MEI?: string;
    SalaoId: string; 
    Portfolio?: Portfolio; 
    Agendamentos?: Agendamentos[];
    Holerite?: Holerite[];
    DataCadastro?: Date;
  }
  