import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cliente } from "../../models/clienteModel";
import { userTypes } from "../../models/tipo-usuario.enum";
import { AuthControl } from "../../models/authModel";
import { ClienteService } from "../../services/ClienteService";
import { LoginService } from "../../services/LoginService";
import {
  cpfMask,
  telefoneMask,
  validarCPF,
  validarEmail,
  validarSenha,
} from "../../utils/validations";

interface FormErrors {
  CPF?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
  confirmacaoSenha?: string;
}

export const useClienteCadastro = (salaoId: string) => {
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente>({
    CPF: "",
    Nome: "",
    Email: "",
    Telefone: 0,
    SalaoId: salaoId,
    Agendamentos: [],
    HistoricoSimulacao: [],
  });

  const [auth, setAuth] = useState<AuthControl>({
    email: "",
    salaoId: salaoId,
    senha: "",
    type: userTypes.Cliente,
  });

  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [cpfFormatado, setCpfFormatado] = useState("");
  const [telefoneFormatado, setTelefoneFormatado] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setAuth((prev) => ({ ...prev, email: cliente.Email }));
  }, [cliente.Email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuth((prev) => ({ ...prev, [name]: value }));

    if (name === "senha" && errors.senha) {
      setErrors((prev) => ({ ...prev, senha: undefined }));
    }

    if (name === "email") {
      setCliente((prev) => ({ ...prev, Email: value }));
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    }
  };

  const handleConfirmacaoSenhaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmacaoSenha(e.target.value);
    if (errors.confirmacaoSenha) {
      setErrors((prev) => ({ ...prev, confirmacaoSenha: undefined }));
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = cpfMask(e.target.value);
    setCpfFormatado(maskedValue);

    const numericValue = maskedValue.replace(/\D/g, "");
    setCliente((prev) => ({ ...prev, CPF: numericValue }));

    if (errors.CPF) {
      setErrors((prev) => ({ ...prev, CPF: undefined }));
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = telefoneMask(e.target.value);
    setTelefoneFormatado(maskedValue);

    const numericValue = Number(maskedValue.replace(/\D/g, ""));
    setCliente((prev) => ({ ...prev, Telefone: numericValue }));

    if (errors.telefone) {
      setErrors((prev) => ({ ...prev, telefone: undefined }));
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};

    if (!cliente.CPF) {
      newErrors.CPF = "CPF é obrigatório";
    } else if (!validarCPF(cliente.CPF)) {
      newErrors.CPF = "CPF inválido";
    } else {
      const cpfExiste = await ClienteService.verificarClienteCpfExistente(
        cliente.CPF,
        cliente.SalaoId
      );
      if (cpfExiste) {
        newErrors.CPF = "Este CPF já está cadastrado";
      }
    }

    if (!cliente.Nome) {
      newErrors.nome = "Nome é obrigatório";
    } else if (cliente.Nome.length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!cliente.Email) {
      newErrors.email = "Email é obrigatório";
    } else if (!validarEmail(cliente.Email)) {
      newErrors.email = "Email inválido";
    } else {
      const EmailExiste = await ClienteService.verificarClienteEmailExistente(
        cliente.Email,
        cliente.SalaoId
      );
      if (EmailExiste) {
        newErrors.email = "Este Email já está cadastrado";
      }
    }

    if (!cliente.Telefone) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (String(cliente.Telefone).length < 10) {
      newErrors.telefone = "Telefone inválido";
    }

    if (!auth.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (!validarSenha(auth.senha)) {
      newErrors.senha =
        "A senha deve ter pelo menos 8 caracteres, incluir letras maiúsculas, minúsculas, números e caracteres especiais";
    }

    if (auth.senha !== confirmacaoSenha) {
      newErrors.confirmacaoSenha = "As senhas não conferem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (auth.email !== cliente.Email) {
        setCliente((prev) => ({ ...prev, Email: auth.email }));
      }

      const isValid = await validateForm();
      if (!isValid) {
        setLoading(false);
        return;
      }

      const authResponse = await LoginService.cadastrar(auth);

      await ClienteService.cadastrarCliente(cliente);

      await LoginService.login(auth.email, auth.senha, auth.salaoId);
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    cliente,
    auth,
    cpfFormatado,
    telefoneFormatado,
    confirmacaoSenha,
    errors,
    loading,
    saveSuccess,
    setSaveSuccess,
    handleChange,
    handleAuthChange,
    handleCPFChange,
    handleTelefoneChange,
    handleConfirmacaoSenhaChange,
    handleSubmit,
    setCliente,
    setAuth,
    setConfirmacaoSenha,
    setErrors,
    setTelefoneFormatado,
  };
};
