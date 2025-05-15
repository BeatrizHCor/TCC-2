import { Atendimento } from "./atendimentoModal";
import { Cabeleireiro } from "./cabelereiroModel";
import { Cliente } from "./clienteModel";
import { StatusAgendamento } from "./StatusAgendamento.enum";

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