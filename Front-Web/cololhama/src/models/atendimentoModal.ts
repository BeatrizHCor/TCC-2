import { Agendamentos } from "./agendamentoModel";
import { AtendimentoAuxiliar } from "./atendimentoAuxiliarModel";
import { ServicoAtendimento } from "./servicoAtendimentoModel";

export interface Atendimento {
    ID?: string;
    Data: Date;
    PrecoTotal: number;
    FuncionarioId: string;
    Auxiliar: boolean;
    AtendimentoAuxiliar?: AtendimentoAuxiliar;
    SalaoId: string;
    ServicoAtendimento: ServicoAtendimento[];
    Agendamentos: Agendamentos[];
  }
  