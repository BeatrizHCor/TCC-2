import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Servico } from "../../models/servicoModel";
import ServicoService from "../../services/ServicoService";
//import { useAuth } from "../../contexts/AuthContext"; 
const salaoId = import.meta.env.SALAO_ID || "1"; // ID do salão, pode ser obtido de outra forma se necessário
interface ValidationErrors {
  nome?: string;
  descricao?: string;
  precoMin?: string;
  precoMax?: string;
}

export const useManterServico = (servicoId?: string) => {

  const [Nome, setNome] = useState("");
  const [Descricao, setDescricao] = useState("");
  const [PrecoMin, setPrecoMin] = useState<number>(0);
  const [PrecoMax, setPrecoMax] = useState<number>(0);
  const [SalaoId, setSalaoId] = useState<string | null>(null);
  

  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isEditing, setIsEditing] = useState(false);
  
  const navigate = useNavigate();
 
  // const { user } = useAuth(); 
 const user  = {
    role : "admin",
    salaoId : "1",
 }; // Simulando o usuário autenticado

 
  useEffect(() => {
    const fetchServico = async () => {
      if (!servicoId) {
        setIsEditing(false);
        return;
      }

      setIsEditing(true);
      setIsLoading(true);
      
      try {
        
        const servico = await ServicoService.getServicoById(servicoId);
        
        
        setNome(servico.Nome || "");
        setDescricao(servico.Descricao || "");
        setPrecoMin(servico.PrecoMin || 0);
        setPrecoMax(servico.PrecoMax || 0);
        setSalaoId(servico.SalaoId || null);
      } catch (error) {
        console.error("Erro ao buscar serviço:", error);
        navigate("/servicos", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      setSalaoId(user.salaoId); 
      
      if (servicoId) {
        fetchServico();
      }
    }
  }, [servicoId]);


  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!Nome.trim()) {
      errors.nome = "Nome do serviço é obrigatório";
    }
    
    if (PrecoMin < 0) {
      errors.precoMin = "Preço mínimo não pode ser negativo";
    }
    
    if (PrecoMax < PrecoMin) {
      errors.precoMax = "Preço máximo deve ser maior que o preço mínimo";
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
      const servicoData: Servico = {
        Nome,
        SalaoId: salaoId,      
        PrecoMin,
        PrecoMax,
        Descricao,
      };
      
      if (isEditing && servicoId) {
        await ServicoService.updateServico(servicoId, servicoData);
      } else {
        await ServicoService.createServico(servicoData);
      }
      
      navigate(-1);
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
   
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !servicoId) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await ServicoService.deleteServico(servicoId);
      navigate(-1);
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      
    } finally {
      setIsLoading(false);
    }
  };

  return {
    Nome,
    setNome,
    Descricao,
    setDescricao,
    PrecoMin,
    setPrecoMin,
    PrecoMax,
    setPrecoMax,
    salaoId,
    isLoading,
    isEditing,
    validationErrors,
    handleSubmit,
    handleDelete
  };
};
export default useManterServico;