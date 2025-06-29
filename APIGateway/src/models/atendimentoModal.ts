import { Agendamentos } from "./agendamentoModel";
import { AtendimentoAuxiliar } from "./atendimentoAuxiliarModel";
import { Funcionario } from "./funcionarioModel";
import { Salao } from "./salaoModel";
import { ServicoAtendimento } from "./servicoAtendimentoModel";

export interface Atendimento {
    ID?: string;
    Data: Date;
    PrecoTotal: number;
    Auxiliar: boolean;
    AtendimentoAuxiliar?: AtendimentoAuxiliar;
    SalaoId: string;
    Salao?: Salao;
    ServicoAtendimento: ServicoAtendimento[];
    Agendamentos: Agendamentos[];
  }