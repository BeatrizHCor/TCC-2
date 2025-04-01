import { Agendamentos } from "./AgendamentoModel";
import { HistoricoSimulacao } from "./historicoSimulacaoModel";

export interface Cliente {
    id?: string;  
    CPF: string;
    nome: string;
    email: string;
    telefone: number;
    salaoId: string;
    agendamentos: Agendamentos[];
    historicoSimulacao: HistoricoSimulacao[];
  }
  