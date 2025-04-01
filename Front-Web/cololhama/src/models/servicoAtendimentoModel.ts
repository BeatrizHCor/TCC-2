import { Atendimento } from "./atendimentoModal";
import { Servico } from "./servicoModel";

export interface ServicoAtendimento {
    id?: string;
    precoItem: number;
    atendimentoId: string;
    atendimento?: Atendimento;
    servicoId: string;
    servico: Servico;
  }