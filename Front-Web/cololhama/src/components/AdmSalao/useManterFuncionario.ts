import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FuncionarioService from "../../services/FuncionarioService";
import { validarCPF, validarEmail } from "../../utils/validations";
import { Funcionario } from "../../models/funcionarioModel";
// LEMBRETE: tratamento de erros a serem devidamente colocados,
// qundo terminar replicar logica para outras paginas de CRUD
const SalaoId: string = import.meta.env.SALAO_ID || "1";

interface ValidationErrors {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  salario?: string;
  password?: string;
  confirmPassword?: string;
}

export const useManterFuncionario = (funcionarioId?: string) => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [auxiliar, setAuxiliar] = useState(false);
  const [salario, setSalario] = useState<number | undefined>(undefined);
  const [salaoId, setSalaoId] = useState<string | null>(
    import.meta.env.VITE_SALAO_ID
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forbidden, setForbidden] = useState<boolean>(false);
  const [deleteResult, setDeleteResult] = useState<{
    status: string;
    message: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFuncionario = async () => {
      if (!funcionarioId) {
        setIsEditing(false);
        return;
      }

      setIsEditing(true);
      setIsLoading(true);

      try {
        const funcionario = await FuncionarioService.getFuncionarioById(
          funcionarioId
        );
        console.log("Funcionário:", funcionario);
        if (typeof funcionario === "boolean") {
          setForbidden(true);
        } else {
          setNome(funcionario.Nome || "");
          setCpf(funcionario.CPF || "");
          setEmail(funcionario.Email || "");
          setTelefone(funcionario.Telefone || "");
          setAuxiliar(funcionario.Auxiliar || false);
          setSalario(funcionario.Salario);
          setSalaoId(funcionario.SalaoId || null);
        }
      } catch (error) {
        console.error("Erro ao buscar funcionário:", error);

        navigate("/funcionarios", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    if (funcionarioId) {
      fetchFuncionario();
    }
  }, [funcionarioId]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!nome.trim()) {
      errors.nome = "Nome do funcionário é obrigatório";
    }

    if (!isEditing && !cpf.trim()) {
      errors.cpf = "CPF é obrigatório";
    } else if (!isEditing && !validarCPF(cpf)) {
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

    if (salario !== undefined && salario < 0) {
      errors.salario = "Salário não pode ser negativo";
    }
    if (salario !== undefined && isNaN(Number(salario))) {
      errors.salario = "Salário deve ser um número válido";
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
      if (isEditing && funcionarioId) {
        await FuncionarioService.updateFuncionario(
          funcionarioId,
          nome,
          cpf,
          email,
          telefone,
          salaoId,
          auxiliar,
          salario,
          password
        );
      } else {
        await FuncionarioService.cadastrarFuncionario(
          cpf,
          nome,
          email,
          telefone,
          salaoId,
          auxiliar,
          salario ?? 0,
          password
        );
      }

      navigate("/funcionarios");
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);

      if (error instanceof Error) {
        setValidationErrors(mapErrorToValidation(error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !funcionarioId) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await FuncionarioService.deleteFuncionario(funcionarioId);
      if (result && result.status) {
        setDeleteResult(result);
      } else {
        setDeleteResult({
          status: "erro",
          message: "Erro ao excluir funcionário.",
        });
      }
    } catch (error) {
      setDeleteResult({
        status: "erro",
        message: "Erro ao excluir funcionário.",
      });
      console.error("Erro ao excluir funcionário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function mapErrorToValidation(errorMessage: string): ValidationErrors {
    if (errorMessage.includes("CPF já cadastrado")) {
      return { cpf: "Este CPF já está em uso" };
    }
    if (errorMessage.includes("Email já cadastrado")) {
      return { email: "Este email já está em uso" };
    }
    if (errorMessage.includes("Telefone já cadastrado")) {
      return { telefone: "Este telefone já está em uso" };
    }
    if (errorMessage.includes("Senha muito curta")) {
      return { password: "A senha deve ter pelo menos 6 caracteres" };
    }
    if (errorMessage.includes("Nome obrigatório")) {
      return { nome: "Nome do funcionário é obrigatório" };
    }
    if (errorMessage.includes("CPF inválido")) {
      return { cpf: "CPF inválido" };
    }
    if (errorMessage.includes("Email inválido")) {
      return { email: "Email inválido" };
    }
    if (errorMessage.includes("Salário inválido")) {
      return { salario: "Salário deve ser um número válido" };
    }
    return { cpf: "Erro ao salvar funcionário. Tente novamente." };
  }

  return {
    nome,
    setNome,
    cpf,
    setCpf,
    email,
    setEmail,
    telefone,
    setTelefone,
    auxiliar,
    setAuxiliar,
    salario,
    setSalario,
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    salaoId,
    isLoading,
    isEditing,
    validationErrors,
    handleSubmit,
    handleDelete,
    deleteResult,
    setDeleteResult,
    forbidden,
  };
};

export default useManterFuncionario;
