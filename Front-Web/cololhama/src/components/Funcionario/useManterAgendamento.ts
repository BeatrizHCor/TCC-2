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
  userId?: string, // Adicionar userId como parâmetro
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
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  const navigate = useNavigate();

  const canSaveEdit = (): boolean => {
    if (!isEditing || !data) return true;

    const agendamentoDate = new Date(data);
    const currentDate = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(currentDate.getDate() + 3);

    return agendamentoDate > threeDaysFromNow;
  };

  const fetchHorariosOcupados = async (cabeleireiroIdParam: string, dataParam?: string) => {
    if (!salaoId || !cabeleireiroIdParam) return;

    setLoadingHorarios(true);
    try {
      const dataParaBusca = dataParam || new Date().toISOString().split('T')[0];
      const horarios = await AgendamentoService.getHorariosOcupadosFuturos(
        salaoId,
        cabeleireiroIdParam,
        dataParaBusca
      );
      if (horarios !== false) {
        setHorariosOcupados(horarios);
      } else {
        setHorariosOcupados([]);
      }
    } catch (error) {
      console.error("Erro ao buscar horários ocupados:", error);
      setHorariosOcupados([]);
    } finally {
      setLoadingHorarios(false);
    }
  };

  // Função para verificar se um horário está ocupado
  const isHorarioOcupado = (dataHora: string): boolean => {
    if (!dataHora || horariosOcupados.length === 0) return false;
    
    const dataHoraISO = new Date(dataHora).toISOString();
    return horariosOcupados.some(horario => {
      const horarioISO = new Date(horario).toISOString();
      return horarioISO === dataHoraISO;
    });
  };

  // Função customizada para setar cabeleireiro que também busca horários
  const setCabeleireiroIdWithHorarios = (id: string) => {
    setCabeleireiroId(id);
    if (id) {
      fetchHorariosOcupados(id, data);
    } else {
      setHorariosOcupados([]);
    }
  };

  // Função customizada para setar data que também busca horários
  const setDataWithHorarios = (novaData: string) => {
    setData(novaData);
    if (cabeleireiroId && novaData) {
      const dataParaBusca = novaData.split('T')[0]; // Pega apenas a data (YYYY-MM-DD)
      fetchHorariosOcupados(cabeleireiroId, dataParaBusca);
    }
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

        // Preencher automaticamente baseado no tipo de usuário
        if (!isEditing && userId) {
          if (userType === userTypes.Cliente) {
            setClienteId(userId);
            // Buscar nome do cliente se necessário
            const clientes = await ClienteService.getClientesBySalao(salaoId);
            const clienteLogado = clientes.find(c => c.ID === userId);
            if (clienteLogado) {
              setClienteNome(clienteLogado.Nome);
            }
          } else if (userType === userTypes.Cabeleireiro) {
            const cabeleireiroLogado = cabeleireiros.find(c => c.ID === userId);
            if (cabeleireiroLogado) {
              setCabeleireiroId(userId);
              setCabeleireiroNome(cabeleireiroLogado.Nome);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [salaoId, userType, userId, isEditing]);

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

        // Buscar horários ocupados para o cabeleireiro do agendamento
        if (agendamento.CabeleireiroID && agendamento.SalaoId) {
          const dataParaBusca = dataFormatted.split('T')[0];
          fetchHorariosOcupados(agendamento.CabeleireiroID, dataParaBusca);
        }
      } catch (error: unknown) {
        console.error("Erro ao carregar agendamento:", error);
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
      } else if (isHorarioOcupado(data) && !isEditing) {
        errors.data = "Este horário já está ocupado";
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
        switch (userType) {
          case userTypes.Funcionario:
          case userTypes.AdmSalao:
          case userTypes.AdmSistema:
            await AgendamentoService.updateFuncionarioAgendamento(
              agendamentoId,
              new Date(data).toISOString(),
              status,
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
      } else {
        switch (userType) {
          case userTypes.Funcionario:
          case userTypes.AdmSalao:
          case userTypes.AdmSistema:
            await AgendamentoService.createFuncionarioAgendamento(
              new Date(data).toISOString(),
              clienteId,
              cabeleireiroId,
              salaoId,
              servicosIds,
            );
            break;
          case userTypes.Cabeleireiro:
            await AgendamentoService.createCabeleireiroAgendamento(
              new Date(data).toISOString(),
              clienteId,
              cabeleireiroId,
              salaoId,
              servicosIds,
            );
            break;
          case userTypes.Cliente:
            await AgendamentoService.createClienteAgendamento(
              new Date(data).toISOString(),
              clienteId,
              cabeleireiroId,
              salaoId,
              servicosIds,
            );
            break;
          default:
            throw new Error("Tipo de usuário inválido");
        }
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !agendamentoId) {
      return;
    }

    setIsLoading(true);

    try {
      let deleted = false;
      switch (userType) {
        case userTypes.Funcionario:
        case userTypes.AdmSalao:
        case userTypes.AdmSistema:
          deleted = await AgendamentoService.deleteFuncionarioAgendamento(
            agendamentoId,
          );
          break;
        case userTypes.Cabeleireiro:
          deleted = await AgendamentoService.deleteCabeleireiroAgendamento(
            agendamentoId,
          );
          break;
        case userTypes.Cliente:
          deleted = await AgendamentoService.deleteClienteAgendamento(
            agendamentoId,
          );
          break;
        default:
          throw new Error("Tipo de usuário inválido");
      }
      if (deleted) {
        navigate(-1);
      }
    } catch (error: unknown) {
      console.error("Erro ao excluir agendamento:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setForbidden(true);
        }
      } else {
        console.error("Erro desconhecido:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    setData: setDataWithHorarios,
    status,
    setStatus,
    clienteId,
    setClienteId,
    cabeleireiroId,
    setCabeleireiroId: setCabeleireiroIdWithHorarios,
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
    horariosOcupados,
    loadingHorarios,
    isHorarioOcupado,
  };
};

export default useManterAgendamento;