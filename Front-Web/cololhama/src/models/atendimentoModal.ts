import { Agendamentos } from "./AgendamentoModel";
import { AtendimentoAuxiliar } from "./atendimentoAuxiliarModel";
import { Funcionario } from "./funcionarioModel";
import { Salao } from "./salaoModel";
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
  