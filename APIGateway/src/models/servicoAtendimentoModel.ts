import { Atendimento } from "./atendimentoModal";
import { Servico } from "./servicoModel";

export interface ServicoAtendimento {
    ID?: string;
    PrecoItem: number;
    AtendimentoId: string;
    Atendimento?: Atendimento;
    ServicoId: string;
    Servico: Servico;
  }