import { AdmSalao } from "./admSalaoModel";
import { Agendamentos } from "./AgendamentoModel";
import { Atendimento } from "./atendimentoModal";
import { Cabeleireiro } from "./cabelereiroModel";
import { Cliente } from "./clienteModel";
import { Funcionario } from "./funcionarioModel";
import { Gastos } from "./gastosModel";
import { HistoricoSimulacao } from "./historicoSimulacaoModel";
import { Holerite } from "./holeriteModel";
import { PagamentosAssinatura } from "./pagamentoAssinaturaModel";
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
    PagamentosAssinatura: PagamentosAssinatura[];
    Cabeleireiros: Cabeleireiro[];
    Adm?: AdmSalao;
    Atendimentos: Atendimento[];
    Portfolio: Portfolio[];
    Servico: Servico[];
    Agendamentos: Agendamentos[];
    Holerite: Holerite[];
    Gastos: Gastos[];
    HistoricoSimulacao: HistoricoSimulacao[];
  }
  