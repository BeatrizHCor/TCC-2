export interface Agendamentos {
    ID?: string;
    Data: Date;
    Status: StatusAgendamento;
    ClienteID: string;
    SalaoId: string;
    CabeleireiroID: string;
    AtendimentoID?: string;
  
  }