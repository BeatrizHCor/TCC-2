import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userTypes } from "../../models/tipo-usuario.enum";
import { ClienteService } from "../../services/ClienteService";
import {
  cpfMask,
  telefoneMask,
  validarCPF,
  validarEmail,
  validarSenha,
  validarTelefone,
} from "../../utils/validations";

interface FormErrors {
  CPF?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  password?: string;
  confirmacaoSenha?: string;
  general?: string; //erros gerais
}

export const useClienteCadastro = (salaoId: string) => {
  const navigate = useNavigate();

  const [cadastro, setCadastro] = useState({
    CPF: "",
    nome: "",
    email: "",
    telefone: "",
    salaoId: salaoId,
    password: "",
    userType: userTypes.Cliente,
  });

  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [cpfFormatado, setCpfFormatado] = useState("");
  const [telefoneFormatado, setTelefoneFormatado] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCadastro((prev) => ({ ...prev, [name]: value }));

    if (submitAttempted) {
      validateField(name, value);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = cpfMask(e.target.value);
    setCpfFormatado(maskedValue);

    const numericValue = maskedValue.replace(/\D/g, "");
    setCadastro((prev) => ({ ...prev, CPF: numericValue }));

    if (submitAttempted) {
      validateField("CPF", numericValue);
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = telefoneMask(e.target.value);
    setTelefoneFormatado(maskedValue);

    const numericValue = maskedValue.replace(/\D/g, "");
    setCadastro((prev) => ({ ...prev, telefone: numericValue }));

    if (submitAttempted) {
      validateField("telefone", numericValue);
    }
  };

  const handleConfirmacaoSenhaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setConfirmacaoSenha(value);

    if (submitAttempted) {
      validateField("confirmacaoSenha", value);
    }
  };

  const validateField = (fieldName: string, value: string) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case "nome":
        if (!value.trim()) {
          newErrors.nome = "Nome é obrigatório";
        } else {
          delete newErrors.nome;
        }
        break;
      
      case "CPF":
        if (!validarCPF(value)) {
          newErrors.CPF = "CPF inválido";
        } else {
          delete newErrors.CPF;
        }
        break;
      
      case "telefone":
        if (!validarTelefone(value)) {
          newErrors.telefone = "Telefone inválido";
        } else {
          delete newErrors.telefone;
        }
        break;
      
      case "email":
        if (!value || !validarEmail(value)) {
          newErrors.email = "Email inválido";
        } else {
          delete newErrors.email;
        }
        break;
      
      case "password":
        if (!value || !validarSenha(value)) {
          newErrors.password = "Senha deve conter pelo menos 8 caracteres, incluindo letras e números";
        } else {
          delete newErrors.password;
        }
        break;
      
      case "confirmacaoSenha":
        if (!value || value !== cadastro.password) {
          newErrors.confirmacaoSenha = "As senhas não coincidem";
        } else {
          delete newErrors.confirmacaoSenha;
        }
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = async () => {
    const newErrors: FormErrors = {};

    if (!cadastro.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!validarCPF(cadastro.CPF)) {
      newErrors.CPF = "CPF inválido";
    } else {
      try {
        const cpfExiste = await ClienteService.getClienteByCpfAndSalao(
          cadastro.CPF,
          salaoId
        );
        if (cpfExiste) {
          newErrors.CPF = "CPF já cadastrado neste salão";
        }
      } catch (error) {
        console.error("Erro ao verificar CPF:", error);
        newErrors.general = "Erro ao verificar CPF. Tente novamente.";
      }
    }

    if (!validarTelefone(cadastro.telefone)) {
      newErrors.telefone = "Telefone inválido (formato esperado: (XX) XXXXX-XXXX)";
    }

    if (!cadastro.email || !validarEmail(cadastro.email)) {
      newErrors.email = "Email inválido (exemplo: nome@exemplo.com)";
    }

    if (!cadastro.password || !validarSenha(cadastro.password)) {
      newErrors.password = "Senha deve conter pelo menos 8 caracteres, incluindo letras e números";
    }

    if (!confirmacaoSenha || confirmacaoSenha !== cadastro.password) {
      newErrors.confirmacaoSenha = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setLoading(true);
    
    setErrors(prev => ({ ...prev, general: undefined }));

    try {
      const isValid = await validateForm();

      if (!isValid) {
        setLoading(false);
        
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          const element = document.querySelector(`[name="${firstError}"]`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return;
      }

      const response = await ClienteService.cadastrarCliente(cadastro);

      if (!response) {
        throw new Error("Resposta inválida do servidor");
      }

      setCadastro({
        CPF: "",
        nome: "",
        email: "",
        telefone: "",
        salaoId: salaoId,
        password: "",
        userType: userTypes.Cliente,
      });
      setConfirmacaoSenha("");
      setCpfFormatado("");
      setTelefoneFormatado("");
      
      alert("Cadastro realizado com sucesso! Você será redirecionado.");
      setTimeout(() => navigate("/"), 1500);
      
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      
      let errorMessage = "Erro ao cadastrar. Tente novamente.";
      
      if (error.response) {
        const apiError = error.response.data;
        if (apiError.message) {
          errorMessage = apiError.message;
        } else if (apiError.errors) {
          const backendErrors = apiError.errors.reduce((acc: FormErrors, curr: any) => {
            acc[curr.field as keyof FormErrors] = curr.message;
            return acc;
          }, {});
          setErrors(prev => ({ ...prev, ...backendErrors }));
          errorMessage = "Por favor, corrija os erros destacados.";
        }
      } else if (error.request) {
        errorMessage = "Sem resposta do servidor. Verifique sua conexão.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setErrors(prev => ({ ...prev, general: errorMessage }));
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return {
    cadastro,
    cpfFormatado,
    telefoneFormatado,
    confirmacaoSenha,
    errors,
    loading,
    handleChange,
    handleCPFChange,
    handleTelefoneChange,
    handleSubmit,
    handleConfirmacaoSenhaChange,
  };
};