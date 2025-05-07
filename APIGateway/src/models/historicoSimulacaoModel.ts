import { Imagem } from "./imagemModel";

export interface HistoricoSimulacao {
    ID?: string;
    Data: Date;
    ClienteId: string;
    SalaoId: string;
    Imagem?: Imagem[];
  }