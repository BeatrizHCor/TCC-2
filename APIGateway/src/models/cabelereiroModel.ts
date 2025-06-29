import { Agendamentos } from "./agendamentoModel";
import { Portfolio } from "./portifolioModel";
import { StatusCadastro } from "./status.cadastro.enum";

export interface Cabeleireiro {
    ID?: string;
    CPF: string;
    Nome: string;
    Email: string;
    Telefone: string;
    Mei: string;
    SalaoId: string; 
    Portfolio?: Portfolio; 
    Agendamentos?: Agendamentos[];
    DataCadastro?: Date;
    Status?: StatusCadastro
  }
  