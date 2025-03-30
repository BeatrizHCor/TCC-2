export interface Cliente {
    CPF: string;
    Nome: string;
    Email: string;
    Telefone: number;
    Senha: string;
    SalaoId: string; // Referenced field from the Salao model
    Agendamentos: Agendamento[];
    HistoricoSimulacao: HistoricoSimulacao[];
  }