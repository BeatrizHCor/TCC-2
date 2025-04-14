import { Agendamentos } from "./agendamentoModel";
import { HistoricoSimulacao } from "./historicoSimulacaoModel";

export interface Cliente {
    id?: string;  
    CPF: string;
    nome: string;
    email: string;
    telefone: string;
    salaoId: string;
    agendamentos?: Agendamentos[];
    historicoSimulacao?: HistoricoSimulacao[];
    dataCadastro?: Date;
  }
  