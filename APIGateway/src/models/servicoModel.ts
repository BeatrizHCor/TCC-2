import { ServicoAgendamento } from "./servicoAgendamentoModel";
import { ServicoAtendimento } from "./servicoAtendimentoModel";

export interface Servico {
    ID?: string;
    SalaoId: string;
    Nome: string;
    PrecoMin: number;
    PrecoMax: number;
    Descricao: string;
    ServicoAtendimento?: ServicoAtendimento[];
    ServicoAgendamento?: ServicoAgendamento[];
  }