import { Servico } from './servicoModel';
import { Agendamentos } from './agendamentoModel';

export interface ServicoAgendamento {
    ID?: string;
    Nome: string;
    PrecoMin: number;
    PrecoMax: number;
    AgendamentoId: string;
    Agendamento?: Agendamentos;
    ServicoId: string;
    Servico?: Servico;
}