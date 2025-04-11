import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cliente } from '../../models/clienteModel';
import { userTypes } from '../../models/tipo-usuario.enum';
import { AuthControl } from '../../models/authModel';
import { ClienteService } from '../../services/ClienteService';
import { LoginService } from '../../services/LoginService';
import { cpfMask, telefoneMask, validarCPF, validarEmail, validarSenha, validarTelefone } from '../../utils/validations';

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
    CPF: '',
    Nome: '',
    Email: '',
    Telefone: '',
    SalaoId: salaoId,
    Agendamentos: [],
    HistoricoSimulacao: []
  });
  
  const [auth, setAuth] = useState<AuthControl>({
    email: '',
    salaoId: salaoId,
    senha: '',
    type: userTypes.Cliente
  });
  
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [cpfFormatado, setCpfFormatado] = useState('');
  const [telefoneFormatado, setTelefoneFormatado] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setAuth(prev => ({ ...prev, email: cliente.Email }));
  }, [cliente.Email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuth(prev => ({ ...prev, [name]: value }));
    
    if (name === 'senha' && errors.senha) {
      setErrors(prev => ({ ...prev, senha: undefined }));
    }
    
    if (name === 'email') {
      setCliente(prev => ({ ...prev, Email: value }));
      if (errors.email) {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    }
  };

  const handleConfirmacaoSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmacaoSenha(e.target.value);
    if (errors.confirmacaoSenha) {
      setErrors(prev => ({ ...prev, confirmacaoSenha: undefined }));
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = cpfMask(e.target.value);
    setCpfFormatado(maskedValue);
    
    const numericValue = maskedValue.replace(/\D/g, '');
    setCliente(prev => ({ ...prev, CPF: numericValue }));
    
    if (errors.CPF) {
      setErrors(prev => ({ ...prev, CPF: undefined }));
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = telefoneMask(e.target.value);
    setTelefoneFormatado(maskedValue);
    
    const numericValue = Number(maskedValue.replace(/\D/g, ''));
    setCliente(prev => ({ ...prev, Telefone: numericValue.toString() }));
    
    if (errors.telefone) {
      setErrors(prev => ({ ...prev, telefone: undefined }));
    }
  };
  const validateForm = async () => {
    const newErrors: FormErrors = {};
  
    if (!cliente.Nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
  
    if (!validarCPF(cliente.CPF)) {
      newErrors.CPF = 'CPF inválido';
    } else {
      const cpfExiste = await ClienteService.verificarClienteCpfExistente(cliente.CPF, salaoId);
      console.log("Verificando CPF:", cliente.CPF);
      console.log("Resultado da checagem do CPF:", cpfExiste);
      if (cpfExiste) {
        newErrors.CPF = 'CPF já cadastrado';
      }
    }
  
    if (!validarTelefone(cliente.Telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }
  
    if (!cliente.Email || validarEmail(cliente.Email)) {
      newErrors.email = 'Email inválido';
    }
  
    if (!auth.senha || !validarSenha(auth.senha)) {
      newErrors.senha = 'Senha fraca';
    }
  
    if (!confirmacaoSenha || confirmacaoSenha !== auth.senha) {
      newErrors.confirmacaoSenha = 'As senhas não coincidem';
    }
  
    setErrors(newErrors);
  
    console.log("Erros de validação:", newErrors);
  
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    console.log("Iniciando envio de formulário...");
  
    const isValid = await validateForm();
  
    if (!isValid) {
      setLoading(false);
      console.log("Formulário inválido.");
      return;
    }
  
    try {
      console.log("Cadastrando login...");
      await LoginService.cadastrar(auth);
  
      console.log("Cadastrando cliente...");
      await ClienteService.cadastrarCliente(cliente);
  
      console.log("Realizando login automático...");
      await LoginService.login(auth.email, auth.senha, auth.salaoId);
  
      setLoading(false);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar: ' + JSON.stringify(error));
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