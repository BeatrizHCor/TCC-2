export interface Servico {
  id?: string;
  salaoId?: string;
  nome: string;
  descricao: string;
  precoMin?: number;
  precoMax?: number;
}