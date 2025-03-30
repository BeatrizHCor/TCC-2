export interface Salao {
    CNPJ: string;
    Nome: string;
    RazaoSocial: string;
    CEP: string;
    Telefone: number;
    Complemento: string;
    Email: string;
    Clientes: Cliente[];
    Funcionarios: Funcionario[];
    PagamentosAssinatura: PagamentosAssinatura[];
    Cabeleireiros: Cabeleireiro[];
    Adm?: SalaoAdm;
    Atendimentos: Atendimento[];
    Portfolio: Portfolio[];
    Servico: Servico[];
    Agendamentos: Agendamento[];
    Holerite: Holerite[];
    Gastos: Gasto[];
    HistoricoSimulacao: HistoricoSimulacao[];
  }
  