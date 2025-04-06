export interface Agendamentos {
    id?: string;
    data: Date;
    status: StatusAgendamento;
    clienteID: string;
    salaoId: string;
    cabeleireiroID: string;
    atendimentoID?: string;
  
  }