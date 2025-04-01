import { Imagem } from "./imagemModel";

export interface Portfolio {
    id?: string;
    cabeleireiroID: string; 
    saloId: string;
    descricao: string;
    imagem: Imagem[];
  }