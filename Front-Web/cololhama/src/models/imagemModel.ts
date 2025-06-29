import { HistoricoSimulacao } from "./historicoSimulacaoModel";
import { ImagemTipo } from "./imagemTipo.enum";

export interface Imagem {
    fileContent: any;
    ID?: string;
    PortfolioId?: string;
    HistoricoSimulacaoId?: string;
    HistoricoSimulacao: HistoricoSimulacao;
    Endereco: string;
    Descricao?: string;
    Tipo: ImagemTipo;
  }
  