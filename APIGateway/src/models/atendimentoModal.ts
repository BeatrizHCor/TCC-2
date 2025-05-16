import { Agendamentos } from "./agendamentoModel";
import { AtendimentoAuxiliar } from "./atendimentoAuxiliarModel";
import { Funcionario } from "./funcionarioModel";
import { ServicoAtendimento } from "./servicoAtendimentoModel";

export interface Atendimento {
    ID?: string;
    Data: Date;
    PrecoTotal: number;
    FuncionarioId: string;
    Funcionario: Funcionario;
    Auxiliar: boolean;
    AtendimentoAuxiliar?: AtendimentoAuxiliar;
    SalaoId: string;
    ServicoAtendimento: ServicoAtendimento[];
    Agendamentos: Agendamentos[];
  }
  