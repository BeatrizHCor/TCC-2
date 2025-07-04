import { useState, useEffect } from "react";
import { ClienteService } from "../../services/ClienteService";
import {
  cpfMask,
  telefoneMask,
  validarEmail,
  validarTelefone,
} from "../../utils/validations";
import { Cliente } from "../../models/clienteModel";

interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  password?: string;
  confirmacaoSenha?: string;
}

export const usePerfilCliente = (
  ClienteId: string,
  setEditMode?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [perfil, setPerfil] = useState<Cliente>({
    CPF: "",
    Nome: "",
    Email: "",
    Telefone: "",
    SalaoId: "",
  });

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [cpfFormatado, setCpfFormatado] = useState("");
  const [telefoneFormatado, setTelefoneFormatado] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (saveError) setSaveError(false);
      if (saveSuccess) setSaveSuccess(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [saveError, saveSuccess]);

  useEffect(() => {
    const fetchPerfil = async () => {
      setLoading(true);
      try {
        const clienteData = await ClienteService.getClienteById(ClienteId);

        if (clienteData) {
          setPerfil(clienteData);
          setCpfFormatado(cpfMask(clienteData.CPF));
          setTelefoneFormatado(telefoneMask(clienteData.Telefone));
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };
    if (ClienteId) {
      fetchPerfil();
    }
  }, [ClienteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = telefoneMask(e.target.value);
    setTelefoneFormatado(maskedValue);

    const numericValue = maskedValue.replace(/\D/g, "");
    setPerfil((prev) => ({ ...prev, Telefone: numericValue }));

    if (errors.telefone) {
      setErrors((prev) => ({ ...prev, telefone: undefined }));
    }
  };

  const handleNovaSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNovaSenha(value);

    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmacaoSenhaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setConfirmacaoSenha(value);

    if (errors.confirmacaoSenha) {
      setErrors((prev) => ({ ...prev, confirmacaoSenha: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!perfil.Nome?.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!validarTelefone(perfil.Telefone)) {
      newErrors.telefone = "Telefone inválido";
    }

    if (!perfil.Email || !validarEmail(perfil.Email)) {
      newErrors.email = "Email inválido";
    }

    if (novaSenha && confirmacaoSenha && novaSenha !== confirmacaoSenha) {
      newErrors.confirmacaoSenha = "Senhas não coincidem";
    }

    if (novaSenha && !confirmacaoSenha) {
      newErrors.confirmacaoSenha = "Confirme a nova senha";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isValid = validateForm();

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await ClienteService.atualizarCliente(
        ClienteId,
        perfil.CPF,
        perfil.Nome,
        perfil.Email,
        perfil.Telefone,
        perfil.SalaoId,
        novaSenha || undefined
      );
      if (response) {
        setSaveSuccess(true);
        setNovaSenha("");
        setConfirmacaoSenha("");
        if (setEditMode) setEditMode(false); 
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setSaveError(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    perfil,
    setPerfil,
    cpfFormatado,
    telefoneFormatado,
    setTelefoneFormatado,
    novaSenha,
    confirmacaoSenha,
    setConfirmacaoSenha,
    errors,
    setErrors,
    loading,
    saveSuccess,
    setSaveSuccess,
    isInitialized,
    handleChange,
    handleTelefoneChange,
    handleNovaSenhaChange,
    handleSubmit,
    handleConfirmacaoSenhaChange,
    saveError,
  };
};
