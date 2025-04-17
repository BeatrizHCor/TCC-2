import { ServicoAtendimento } from "./servicoAtendimentoModel";

export interface Servico {
    id?: string;
    salaoId: string;
    nome: string;
    precoMin: number;
    precoMax: number;
    descricao: string;
    servicoAtendimento?: ServicoAtendimento[];
  }