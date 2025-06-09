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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCadastro((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = cpfMask(e.target.value);
    setCpfFormatado(maskedValue);

    const numericValue = maskedValue.replace(/\D/g, "");
    setCadastro((prev) => ({ ...prev, CPF: numericValue }));

    if (errors.CPF) {
      setErrors((prev) => ({ ...prev, CPF: undefined }));
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = telefoneMask(e.target.value);
    setTelefoneFormatado(maskedValue);

    const numericValue = maskedValue.replace(/\D/g, "");
    setCadastro((prev) => ({ ...prev, telefone: numericValue }));

    if (errors.telefone) {
      setErrors((prev) => ({ ...prev, telefone: undefined }));
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
          newErrors.CPF = "CPF já cadastrado";
        }
      } catch (error) {
        console.error("Erro ao verificar CPF:", error);
        // Continua a validação mesmo se houver erro na verificação
      }
    }

    if (!validarTelefone(cadastro.telefone)) {
      newErrors.telefone = "Telefone inválido";
    }

    if (!cadastro.email || !validarEmail(cadastro.email)) {
      newErrors.email = "Email inválido";
    }

    if (!cadastro.password || !validarSenha(cadastro.password)) {
      newErrors.password = "Senha fraca";
    }

    if (!confirmacaoSenha || confirmacaoSenha !== cadastro.password) {
      newErrors.confirmacaoSenha = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Dados antes da validação:", cadastro);

    try {
      const isValid = await validateForm();

      if (!isValid) {
        console.log("Formulário inválido. Erros:", errors);
        setLoading(false);
        return;
      }

      console.log("Enviando dados para cadastro:", {
        CPF: cadastro.CPF,
        nome: cadastro.nome,
        email: cadastro.email,
        telefone: cadastro.telefone,
        salaoId: cadastro.salaoId,
        password: cadastro.password,
        userType: cadastro.userType,
      });

      const response = await ClienteService.cadastrarCliente(cadastro);

      if (!response) {
        console.error("Erro ao cadastrar cliente - resposta falsa.");
        alert("Erro ao cadastrar cliente. Tente novamente.");
        setLoading(false);
        return;
      }

      console.log("Cliente cadastrado com sucesso!");
      alert("Cliente cadastrado com sucesso!");
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      
      // Melhor tratamento de erro
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const errorMessage = axiosError.response?.data?.message || 
                           axiosError.response?.data?.error || 
                           axiosError.message || 
                           "Erro desconhecido";
        alert(`Erro ao cadastrar: ${errorMessage}`);
      } else {
        alert(`Erro ao cadastrar: ${String(error)}`);
      }
      
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