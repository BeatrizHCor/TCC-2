import { Imagem } from "./imagemModel";

export interface HistoricoSimulacao {
    id?: string;
    data: Date;
    clienteId: string;
    salaoId: string;
    imagem?: Imagem[];
  }