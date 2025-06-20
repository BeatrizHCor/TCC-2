import { useState, useEffect } from "react";
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

export const useManterAtendimento = (
  userType: userTypes,
  servicosAgendamento: ServicoAgendamento[],
  agendamentoId: string,
  stateData: string,
  stateCabId: string,
  stateCabNome: string,
  stateCliId: string,
  stateStatus: StatusAgendamento,
  stateCliNome: string
) => {
  const [data, setData] = useState(stateData);
  const [status, setStatus] = useState<StatusAgendamento>(stateStatus);
  const [clienteId, setClienteId] = useState(stateCliId);
  const [cabeleireiroId, setCabeleireiroId] = useState("");
  const [cabeleireiroNome, setCabeleireiroNome] = useState(stateCabNome);
  const [atendimentoId, setAtendimentoId] = useState(stateCabId);
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Servico[]>([]);
  const [clientesDisponiveis, setClientesDisponiveis] = useState<Cliente[]>([]);

  const [cabeleireirosDisponiveis, setCabeleireirosDisponiveis] = useState<
    Cabeleireiro[]
  >([]);
  const [clienteNome, setClienteNome] = useState(stateCliNome);
  const [salaoId, setSalaoId] = useState<string | null>(
    import.meta.env.VITE_SALAO_ID
  );
  const [forbidden, setForbidden] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isEditing, setIsEditing] = useState(false);
  const [precoTotal, setPrecoTotal] = useState(0);
  const navigate = useNavigate();
  const [auxiliares, setAuxiliares] = useState<AtendimentoAuxiliar[]>([]);
  const [servicoAtendimento, setServicoAtendimento] = useState<
    ServicoAtendimento[]
  >([]);
  const canSaveEdit = (): boolean => {
    if (!isEditing || !data) return true;

    const agendamentoDate = new Date(data);
    const currentDate = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(currentDate.getDate() + 3);

    return agendamentoDate > threeDaysFromNow;
  };
  useEffect(() => {
    let v = servicosAgendamento.reduce(
      (sum: number, s: ServicoAgendamento) => sum + s.PrecoMin,
      0
    );
    let serv = servicosAgendamento.map((a) => {
      return {
        PrecoItem: a.PrecoMin,
        ServicoId: a.ServicoId,
      } as ServicoAtendimento;
    });
    setPrecoTotal(v);
    setServicoAtendimento(serv);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!salaoId) return;

      setIsLoading(true);
      try {
        let atendimentoId = "";
        if (agendamentoId) {
          atendimentoId =
            await AtendimentoService.getAtendimentobyAgendamentoId(
              agendamentoId
            );
          setAtendimentoId(atendimentoId);
        }
        const servicos = await ServicoService.getServicosBySalao(salaoId);
        setServicosDisponiveis(servicos);
        const clientes = await ClienteService.getClientesBySalao(salaoId);
        setClientesDisponiveis(clientes);
        const cabeleireiros = await CabeleireiroService.getCabeleireiroBySalao(
          salaoId,
          false
        );
        setCabeleireirosDisponiveis(cabeleireiros);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [salaoId]);

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

    if (servicosAgendamento.length === 0) {
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

    if (isEditing && !canSaveEdit()) {
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
      if (isEditing && agendamentoId) {
      } else {
        await AtendimentoService.updateAtendimento(
          atendimentoId,
          new Date(data),
          precoTotal,
          false,
          salaoId,
          servicoAtendimento,
          auxiliares,
          agendamentoId!
        );
      }
      navigate(-1);
    } catch (error: unknown) {
      console.error("Erro ao salvar agendamento:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setForbidden(true);
        }
      } else {
        console.error("Erro desconhecido:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !agendamentoId) {
      return;
    }

    setIsLoading(true);

    try {
      switch (userType) {
        case userTypes.Funcionario:
          await AgendamentoService.deleteFuncionarioAgendamento(agendamentoId);
          break;
        case userTypes.Cabeleireiro:
          await AgendamentoService.deleteCabeleireiroAgendamento(agendamentoId);
          break;
        case userTypes.Cliente:
          await AgendamentoService.deleteClienteAgendamento(agendamentoId);
          break;
        default:
          throw new Error("Tipo de usuário não suportado para exclusão");
      }
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
    canSaveEdit: canSaveEdit(),
    clienteNome,
    setClienteNome,
    clientesDisponiveis,
  };
};

export default useManterAtendimento;
