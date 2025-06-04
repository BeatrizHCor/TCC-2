import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CabeleireiroService from "../../services/CabeleireiroService";
import { validarCPF, validarEmail } from "../../utils/validations";

const SalaoId = import.meta.env.SALAO_ID || "1";

interface ValidationErrors {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  mei?: string;
  password?: string;
  confirmPassword?: string;
}

export const useManterCabeleireiro = (cabeleireiroId?: string) => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mei, setMei] = useState("");
  const [salaoId, setSalaoId] = useState<string | null>(
    import.meta.env.VITE_SALAO_ID
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forbidden, setForbidden] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCabeleireiro = async () => {
      if (!cabeleireiroId) {
        setIsEditing(false);
        return;
      }

      setIsEditing(true);
      setIsLoading(true);

      try {
        const cabeleireiro = await CabeleireiroService.getCabeleireiroById(
          cabeleireiroId
        );
        console.log("Cabeleireiro:", cabeleireiro);
        setNome(cabeleireiro.Nome || "");
        setCpf(cabeleireiro.CPF || "");
        setEmail(cabeleireiro.Email || "");
        setTelefone(cabeleireiro.Telefone || "");
        setMei(cabeleireiro.Mei || "");
        setSalaoId(cabeleireiro.SalaoId || null);
      } catch (error) {
        console.error("Erro ao buscar cabeleireiro:", error);
        navigate("/cabeleireiros", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    if (cabeleireiroId) {
      fetchCabeleireiro();
    }
  }, [cabeleireiroId]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!nome.trim()) {
      errors.nome = "Nome do cabeleireiro é obrigatório";
    }

    if (!cpf.trim()) {
      errors.cpf = "CPF é obrigatório";
    } else if (!validarCPF(cpf)) {
      errors.cpf = "CPF inválido";
    }

    if (!email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!validarEmail(email)) {
      errors.email = "Email inválido";
    }

    if (!telefone.trim()) {
      errors.telefone = "Telefone é obrigatório";
    }

    if (!mei.trim()) {
      errors.mei = "MEI é obrigatório";
    }
    if (!isEditing && !password.trim()) {
      errors.password = "Senha é obrigatória";
    }
    if (!isEditing && !confirmPassword.trim()) {
      errors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
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

    try {
      if (isEditing && cabeleireiroId) {
        await CabeleireiroService.UpdateCabeleireiro(
          cabeleireiroId,
          cpf,
          nome,
          email,
          telefone,
          mei,
          salaoId,
          password
        );
      } else {
        await CabeleireiroService.cadastrarCabeleireiro(
          cpf,
          nome,
          email,
          telefone,
          mei,
          salaoId,
          password
        );
      }

      navigate(-1);
    } catch (error) {
      console.error("Erro ao salvar cabeleireiro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !cabeleireiroId) {
      return;
    }

    setIsLoading(true);

    try {
      await CabeleireiroService.deleteCabeleireiro(cabeleireiroId);
      navigate(-1);
    } catch (error) {
      console.error("Erro ao excluir cabeleireiro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nome,
    setNome,
    cpf,
    setCpf,
    email,
    setEmail,
    telefone,
    setTelefone,
    mei,
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    setMei,
    salaoId,
    isLoading,
    isEditing,
    validationErrors,
    handleSubmit,
    handleDelete,
    forbidden,
  };
};

export default useManterCabeleireiro;
