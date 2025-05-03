import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CabeleireiroService from "../../services/CabeleireiroService";
import { validarCPF, validarEmail } from "../../utils/validations";
import { Cabeleireiro } from "../../models/cabelereiroModel";

const SalaoId = import.meta.env.SALAO_ID || "1"; 

interface ValidationErrors {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  mei?: string;
}

export const useManterCabeleireiro = (cabeleireiroId?: string) => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mei, setMei] = useState("");
  const [salaoId, setSalaoId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isEditing, setIsEditing] = useState(false);
  
  const navigate = useNavigate();
 
  // const { user } = useAuth(); 
  const user = {
    role: "admin",
    salaoId: SalaoId,
  }; // Simulando o usuário autenticado

  useEffect(() => {
    const fetchCabeleireiro = async () => {
      if (!cabeleireiroId) {
        setIsEditing(false);
        return;
      }

      setIsEditing(true);
      setIsLoading(true);
      
      try {
        const cabeleireiro = await CabeleireiroService.getCabeleireiroById(cabeleireiroId);
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

    if (user && user.role !== "Cliente") {
      setSalaoId(user.salaoId); 
      
      if (cabeleireiroId) {
        fetchCabeleireiro();
      }
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
        const cabeleireiroData: Cabeleireiro = {
          ID: cabeleireiroId || undefined,
          Nome: nome,
          CPF: cpf,
          Email: email,
          Telefone: telefone,
          Mei: mei,
          SalaoId: salaoId,
        };
        await CabeleireiroService.updateCabeleireiro(cabeleireiroData);
      } else {      
        const cabeleireiroData: Cabeleireiro = {
        ID: cabeleireiroId || undefined,
        Nome: nome,
        CPF: cpf,
        Email: email,
        Telefone: telefone,
        Mei: mei,
        SalaoId: salaoId,
      };
        await CabeleireiroService.cadastrarCabeleireiro(cabeleireiroData);
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
    setMei,
    salaoId,
    isLoading,
    isEditing,
    validationErrors,
    handleSubmit,
    handleDelete
  };
};

export default useManterCabeleireiro;