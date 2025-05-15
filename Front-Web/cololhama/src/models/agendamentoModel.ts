import { Atendimento } from "./atendimentoModal";
import { Cabeleireiro } from "./cabelereiroModel";
import { Cliente } from "./clienteModel";

export interface Agendamentos {
    ID?: string;
    Data: Date;
    Status: StatusAgendamento;
    ClienteID: string;
    Cliente: Cliente;
    SalaoId: string;
    CabeleireiroID: string;
    Cabeleireiro?: Cabeleireiro;
    AtendimentoID?: string;
    Atendimento: Atendimento;
  
  }