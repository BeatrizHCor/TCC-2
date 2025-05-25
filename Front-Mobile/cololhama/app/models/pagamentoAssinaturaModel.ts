export interface PagamentosAssinatura {
    ID?: string;
    Data: Date;
    Valor: number;
    SalaoId: string;
    Status: StatusPagamento;
  }