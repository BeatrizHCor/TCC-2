import { Agendamentos } from "./agendamentoModel";
import { Holerite } from "./holeriteModel";
import { Portfolio } from "./portifolioModel";

export interface Cabeleireiro {
    id?: string;
    cpf: string;
    nome: string;
    email: string;
    telefone: string;
    mei?: string;
    salaoId: string; 
    portfolio?: Portfolio; 
    agendamentos: Agendamentos[];
    holerite: Holerite[];
  }
  