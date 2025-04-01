export interface PagamentosAssinatura {
    id?: string;
    data: Date;
    valor: number;
    salaoId: string;
    status: StatusPagamento;
  }