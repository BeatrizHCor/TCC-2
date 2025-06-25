import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgendamentoService from "../../services/AgendamentoService";
import ServicoService from "../../services/ServicoService";
import CabeleireiroService from "../../services/CabeleireiroService";
import { StatusAgendamento } from "../../models/StatusAgendamento.enum";
import { Servico } from "../../models/servicoModel";
import { ServicoAgendamento } from "../../models/servicoAgendamentoModel";
import { Cabeleireiro } from "../../models/cabelereiroModel";
import axios from "axios";
import { userTypes } from "../../models/tipo-usuario.enum";
import AtendimentoService from "../../services/AtendimentoService";
import { AtendimentoAuxiliar } from "../../models/atendimentoAuxiliarModel";
import { ServicoAtendimento } from "../../models/servicoAtendimentoModel";
import { Cliente } from "../../models/clienteModel";
import ClienteService from "../../services/ClienteService";
import { Atendimento } from "../../models/atendimentoModal";
import { Funcionario } from "../../models/funcionarioModel";
import FuncionarioService from "../../services/FuncionarioService";

interface ValidationErrors {
  data?: string;
  status?: string;
  clienteId?: string;
  cabeleireiroId?: string;
  servicos?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

function formatDateToLocalDateTimeString(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

export const useManterAtendimento = (
  userType: userTypes,
  servicosAgendamento: ServicoAgendamento[],
  agendamentoId: string,
  stateData: string,
  stateCabId: string,
  stateCabNome: string,
  stateCliId: string,
  stateStatus: StatusAgendamento,
  stateCliNome: string,
  atendimentoIdFromUrl?: string
) => {
  const [data, setData] = useState(stateData);
  const [status, setStatus] = useState<StatusAgendamento>(stateStatus);
  const [clienteId, setClienteId] = useState(stateCliId);
  const [cabeleireiroId, setCabeleireiroId] = useState(stateCabId);
  const [cabeleireiroNome, setCabeleireiroNome] = useState(stateCabNome);
  const [atendimentoId, setAtendimentoId] = useState(stateCabId);
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Servico[]>([]);
  const [clientesDisponiveis, setClientesDisponiveis] = useState<Cliente[]>([]);
  const [auxiliaresDisponives, setAuxiliaresDisponiveis] = useState<
    Funcionario[]
  >([]);
  const [auxiliar, setAuxiliar] = useState<AtendimentoAuxiliar[]>([]);
  const [auxiliarNome, setAuxiliarNome] = useState("");
  const [cabeleireirosDisponiveis, setCabeleireirosDisponiveis] = useState<
    Cabeleireiro[]
  >([]);
  const [clienteNome, setClienteNome] = useState(stateCliNome);
  const [salaoId, setSalaoId] = useState<string | null>(
    import.meta.env.VITE_SALAO_ID,
  );
  const [forbidden, setForbidden] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [isEditing, setIsEditing] = useState(false);
  const [precoTotal, setPrecoTotal] = useState(0);
  const navigate = useNavigate();
  const [servicoAtendimento, setServicoAtendimento] = useState<
    ServicoAtendimento[]
  >([]);

  useEffect(() => {
    if (servicoAtendimento.length === 0 && servicosAgendamento && servicosAgendamento.length > 0) {
      let serv = servicosAgendamento.map((a) => {
        return {
          PrecoItem: a.PrecoMin,
          ServicoId: a.ServicoId,
        } as ServicoAtendimento;
      });
      setServicoAtendimento(serv);
    }
  }, [servicosAgendamento]);

  useEffect(() => {
    if (
      auxiliar.length > 0 &&
      auxiliaresDisponives.length > 0
    ) {
      const nome = auxiliaresDisponives.find(
        (a) => a.ID === auxiliar[0].AuxiliarID
      )?.Nome;

      setAuxiliarNome(nome || "Nenhum");
    } else {
      setAuxiliarNome("Nenhum");
    }
  }, [auxiliar, auxiliaresDisponives]);


  useEffect(() => {
    let v = servicoAtendimento.reduce(
      (sum: number, s: ServicoAtendimento) => sum + s.PrecoItem,
      0,
    );
    setPrecoTotal(v);
  }, [servicoAtendimento]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!salaoId) return;

      if (atendimentoIdFromUrl) {
        setIsEditing(true);
        setAtendimentoId(atendimentoIdFromUrl);
      }

      setIsLoading(true);

      try {
        const auxiliares = await FuncionarioService.getAuxiliarBySalao(salaoId);
        console.log('Auxiliares carregados:', auxiliares);
        if (auxiliares) {
          setAuxiliaresDisponiveis(auxiliares as Funcionario[]);
        }

        if (agendamentoId && (isEditing || atendimentoIdFromUrl)) {
          const atendimento: Atendimento = await AtendimentoService
            .getAtendimentobyAgendamentoId(agendamentoId);

          if (atendimento) {
            const dataAtendimento = new Date(atendimento.Data as unknown as string);
            setData(formatDateToLocalDateTimeString(dataAtendimento));
            setAtendimentoId(atendimento.ID!);
            setServicoAtendimento(atendimento.ServicoAtendimento);
            setCabeleireiroId(atendimento.Agendamentos[0].CabeleireiroID);
            setClienteId(atendimento.Agendamentos[0].ClienteID);
            setAuxiliar(
              atendimento.AtendimentoAuxiliar || ([] as AtendimentoAuxiliar[]),
            );
            setIsEditing(true);
          }
        }

        const servicos = await ServicoService.getServicosBySalao(salaoId);
        setServicosDisponiveis(servicos);

        const clientes = await ClienteService.getClientesBySalao(salaoId);
        setClientesDisponiveis(clientes);

        const cabeleireiros = await CabeleireiroService.getCabeleireiroBySalao(
          salaoId,
          false,
        );
        setCabeleireirosDisponiveis(cabeleireiros);

      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [salaoId, atendimentoIdFromUrl, agendamentoId]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!data.trim()) {
      errors.data = "Data e hora são obrigatórias";
    } else {
      const agendamentoDate = new Date(data);
      const currentDate = new Date();

      if (agendamentoDate <= currentDate) {
        errors.data = "A data do agendamento deve ser futura";
      }
    }

    if (!status) {
      errors.status = "Status é obrigatório";
    }

    if (!clienteId.trim()) {
      errors.clienteId = "ID do cliente é obrigatório";
    }

    if (!cabeleireiroId.trim()) {
      errors.cabeleireiroId = "Cabeleireiro é obrigatório";
    }

    if (servicoAtendimento.length === 0) {
      errors.servicos = "Pelo menos um serviço deve ser selecionado";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!salaoId) {
      console.error("ID do salão não disponível");
      return;
    }

    setIsLoading(true);
    const servicosIds: string[] = [];
    for (const servico of servicosAgendamento) {
      if (servico.ServicoId) {
        servicosIds.push(servico.ServicoId);
      }
    }

    try {
      if (isEditing && atendimentoId) {
        await AtendimentoService.updateAtendimento(
          atendimentoId,
          new Date(data),
          precoTotal,
          auxiliar.length > 0,
          salaoId,
          servicoAtendimento,
          auxiliar,
          agendamentoId!,
          status,
        );
      } else {
        switch (userType) {
          case userTypes.Funcionario:
          case userTypes.AdmSalao:
          case userTypes.AdmSistema:
            await AgendamentoService.updateFuncionarioAgendamento(
              agendamentoId,
              new Date(data).toISOString(),
              StatusAgendamento.Confirmado,
              clienteId,
              cabeleireiroId,
              salaoId,
              servicosIds,
            );
            break;
          case userTypes.Cabeleireiro:
            await AgendamentoService.updateCabeleireiroAgendamento(
              agendamentoId,
              new Date(data).toISOString(),
              status,
              clienteId,
              cabeleireiroId,
              salaoId,
              servicosIds,
            );
            break;

          case userTypes.Cliente:
            await AgendamentoService.updateClienteAgendamento(
              agendamentoId,
              new Date(data).toISOString(),
              status,
              clienteId,
              cabeleireiroId,
              salaoId,
              servicosIds,
            );
            break;
          default:
            throw new Error("Tipo de usuário inválido");
        }
        await AtendimentoService.createAtendimento(
          new Date(data),
          precoTotal,
          auxiliar.length > 0,
          salaoId,
          servicoAtendimento,
          auxiliar,
          agendamentoId!,
          status,
        );
      }
    } catch (error: unknown) {
      console.error("Erro ao salvar agendamento:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setForbidden(true);
        }
      } else {
        console.error("Erro desconhecido:", error);
      }
    } finally {
      navigate("/atendimentos");
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await AtendimentoService.deleteAtendimento(atendimentoId);
      navigate(-1);
    } catch (error: unknown) {
      console.error("Erro ao excluir agendamento:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setForbidden(true);
        }
      } else {
        console.error("Erro desconhecido:", error);
      }
    }
  };

  return {
    data,
    setData,
    status,
    setStatus,
    clienteId,
    setClienteId,
    cabeleireiroId,
    setCabeleireiroId,
    cabeleireiroNome,
    setCabeleireiroNome,
    servicosAgendamento,
    servicosDisponiveis,
    cabeleireirosDisponiveis,
    salaoId,
    isLoading,
    isEditing,
    validationErrors,
    handleSubmit,
    handleDelete,
    forbidden,
    precoTotal,
    setPrecoTotal,
    servicoAtendimento,
    setServicoAtendimento,
    auxiliar,
    setAuxiliar,
    clienteNome,
    setClienteNome,
    auxiliarNome,
    setAuxiliarNome,
    clientesDisponiveis,
    atendimentoId,
    auxiliaresDisponives,
    setAuxiliaresDisponiveis,
  };
};

export default useManterAtendimento;