import { ServicoAtendimento } from "./servicoAtendimentoModel";

export interface Servico {
    id?: string;
    saloId: string;
    nome: string;
    precoMin: number;
    precoMax: number;
    descricao: string;
    servicoAtendimento: ServicoAtendimento[];
  }