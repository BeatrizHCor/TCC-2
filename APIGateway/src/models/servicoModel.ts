import { ServicoAtendimento } from "./servicoAtendimentoModel";

export interface Servico {
    ID?: string;
    SaloId: string;
    Nome: string;
    PrecoMin: number;
    PrecoMax: number;
    Descricao: string;
    ServicoAtendimento: ServicoAtendimento[];
  }