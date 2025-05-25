import { Cabeleireiro } from "./cabelereiroModel";
import { Imagem } from "./imagemModel";

export interface Portfolio {
    ID?: string;
    CabeleireiroID: string; 
    Cabeleireiro: Cabeleireiro;
    SaloId: string;
    Descricao: string;
    Imagem: Imagem[];
  }