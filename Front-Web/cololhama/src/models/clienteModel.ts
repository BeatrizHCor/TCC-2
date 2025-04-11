import { Agendamentos } from "./agendamentoModel";
import { HistoricoSimulacao } from "./historicoSimulacaoModel";

export interface Cliente {
    id?: string;  
    CPF: string;
    Nome: string;
    Email: string;
    Telefone: string;
    SalaoId: string;
    Agendamentos?: Agendamentos[];
    HistoricoSimulacao?: HistoricoSimulacao[];
    DataCadastro?: Date;
  }
  