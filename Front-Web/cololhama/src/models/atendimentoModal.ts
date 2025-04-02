import { Agendamentos } from "./agendamentoModel";
import { AtendimentoAuxiliar } from "./atendimentoAuxiliarModel";
import { ServicoAtendimento } from "./servicoAtendimentoModel";

export interface Atendimento {
    id?: string;
    data: Date;
    precoTotal: number;
    funcionarioId: string;
    auxiliar: boolean;
    atendimentoAuxiliar?: AtendimentoAuxiliar;
    salaoId: string;
    servicoAtendimento: ServicoAtendimento[];
    agendamentos: Agendamentos[];
  }
  