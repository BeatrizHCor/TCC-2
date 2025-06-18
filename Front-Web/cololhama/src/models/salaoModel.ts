import { AdmSalao } from "./admSalaoModel";
import { Agendamentos } from "./agendamentoModel";
import { Atendimento } from "./atendimentoModal";
import { Cabeleireiro } from "./cabelereiroModel";
import { Cliente } from "./clienteModel";
import { Funcionario } from "./funcionarioModel";
import { HistoricoSimulacao } from "./historicoSimulacaoModel";
import { Portfolio } from "./portifolioModel";
import { Servico } from "./servicoModel";

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
    Cabeleireiros: Cabeleireiro[];
    Adm?: AdmSalao;
    Atendimentos: Atendimento[];
    Portfolio: Portfolio[];
    Servico: Servico[];
    Agendamentos: Agendamentos[];
    HistoricoSimulacao: HistoricoSimulacao[];
  }
  