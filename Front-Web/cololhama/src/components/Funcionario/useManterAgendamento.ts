import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgendamentoService from "../../services/AgendamentoService";
import ServicoService from "../../services/ServicoService";
import CabeleireiroService from "../../services/CabeleireiroService";
import { StatusAgendamento } from "../../models/StatusAgendamento.enum";
import { Servico } from "../../models/servicoModel";
import { ServicoAgendamento } from "../../models/servicoAgendamentoModel";
import { Cabeleireiro } from "../../models/cabelereiroModel";
import { Cliente } from "../../models/clienteModel";
import { userTypes } from "../../models/tipo-usuario.enum";
import ClienteService from "../../services/ClienteService";
import axios from "axios";
interface ValidationErrors {
  data?: string;
  status?: string;
  clienteId?: string;
  cabeleireiroId?: string;
  servicos?: string;
}

export const useManterAgendamento = (
  userType: userTypes,
  agendamentoId?: string,
) => {
  const [data, setData] = useState("");
  const [status, setStatus] = useState<StatusAgendamento>(
    StatusAgendamento.Agendado,
  );
  const [clienteId, setClienteId] = useState("");
  const [clienteNome, setClienteNome] = useState("");
  const [clientesDisponiveis, setClientesDisponiveis] = useState<Cliente[]>([]);
  const [cabeleireiroId, setCabeleireiroId] = useState("");
  const [cabeleireiroNome, setCabeleireiroNome] = useState("");
  const [servicosAgendamento, setServicosAgendamento] = useState<
    ServicoAgendamento[]
  >([]);
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Servico[]>([]);
  const [cabeleireirosDisponiveis, setCabeleireirosDisponiveis] = useState<
    Cabeleireiro[]
  >([]);
  const [salaoId, setSalaoId] = useState<string | null>(
    import.meta.env.VITE_SALAO_ID,
  );
  const [forbidden, setForbidden] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const canSaveEdit = (): boolean => {
    if (!isEditing || !data) return true;

    const agendamentoDate = new Date(data);
    const currentDate = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(currentDate.getDate() + 3);

    return agendamentoDate > threeDaysFromNow;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (!salaoId) return;

      setIsLoading(true);
      try {
        const servicos = await ServicoService.getServicosBySalao(salaoId);
        setServicosDisponiveis(servicos);

        const cabeleireiros = await CabeleireiroService.getCabeleireiroBySalao(
          salaoId,
          false,
        );
        setCabeleireirosDisponiveis(cabeleireiros);

        if (
          userType === userTypes.AdmSalao ||
          userType === userTypes.Funcionario ||
          userType === userTypes.AdmSistema
        ) {
          const clientes = await ClienteService.getClientesBySalao(salaoId);
          setClientesDisponiveis(clientes);
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [salaoId]);

  useEffect(() => {
    const fetchAgendamento = async () => {
      if (!agendamentoId) {
        setIsEditing(false);
        return;
      }

      setIsEditing(true);
      setIsLoading(true);

      try {
        let agendamento;
        switch (userType) {
          case userTypes.Funcionario:
          case userTypes.AdmSalao:
          case userTypes.AdmSistema:
            agendamento = await AgendamentoService
              .getFuncionarioAgendamentoById(agendamentoId);
            break;
          case userTypes.Cabeleireiro:
            agendamento = await AgendamentoService
              .getCabeleireiroAgendamentoById(agendamentoId);
            break;
          case userTypes.Cliente:
            agendamento = await AgendamentoService.getClienteAgendamentoById(
              agendamentoId,
            );
            break;
          default:
            throw new Error("Tipo de usuário inválido");
        }
        const dataFormatted = new Date(agendamento.Data).toISOString().slice(
          0,
          16,
        );
        setData(dataFormatted);
        setStatus(agendamento.Status);
        setClienteId(agendamento.ClienteID);
        setCabeleireiroId(agendamento.CabeleireiroID);
        setCabeleireiroNome(agendamento.Cabeleireiro?.Nome || "");
        setSalaoId(agendamento.SalaoId);

        if (agendamento.ServicoAgendamento) {
          setServicosAgendamento(agendamento.ServicoAgendamento);
        }
      } catch (error: unknown) {
        console.error("Erro ao salvar agendamento:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            setForbidden(true);
          }
        } else {
          console.error("Erro desconhecido:", error);

          navigate("/agendamentos", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (agendamentoId) {
      fetchAgendamento();
    }
  }, [agendamentoId, navigate]);

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
        await AgendamentoService.updateAgendamento(
          agendamentoId,
          new Date(data).toISOString(),
          status,
          clienteId,
          cabeleireiroId,
          salaoId,
          servicosIds,
        );
      } else {
        await AgendamentoService.createAgendamento(
          new Date(data).toISOString(),
          clienteId,
          cabeleireiroId,
          salaoId,
          servicosIds,
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
      await AgendamentoService.deleteAgendamento(agendamentoId);
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
    setServicosAgendamento,
    servicosDisponiveis,
    clienteNome,
    setClienteNome,
    clientesDisponiveis,
    cabeleireirosDisponiveis,
    salaoId,
    isLoading,
    isEditing,
    validationErrors,
    handleSubmit,
    handleDelete,
    forbidden,
    canSaveEdit: canSaveEdit(),
  };
};

export default useManterAgendamento;
