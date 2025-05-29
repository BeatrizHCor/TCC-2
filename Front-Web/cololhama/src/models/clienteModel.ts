import { Agendamentos } from "./agendamentoModel";
import { HistoricoSimulacao } from "./historicoSimulacaoModel";
import { Salao } from "./salaoModel";

export interface Cliente {
    ID?: string;  
    CPF: string;
    Nome: string;
    Email: string;
    Telefone: string;
    SalaoId: string;
    Salao?: Salao;
    Agendamentos?: Agendamentos[];
    HistoricoSimulacao?: HistoricoSimulacao[];
    DataCadastro?: Date;
  }
  