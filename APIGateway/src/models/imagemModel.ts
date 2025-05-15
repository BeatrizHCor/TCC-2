import { HistoricoSimulacao } from "./historicoSimulacaoModel";

export interface Imagem {
    ID?: string;
    PortfolioId?: string;
    HistoricoSimulacaoId?: string;
    HistoricoSimulacao: HistoricoSimulacao;
    Endereco: string;
    Descricao?: string;
  }
  