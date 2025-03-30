import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import cadastrarCliente from '../../services/api-service';

// Tipos de dados
export interface SalaoType {
  CNPJ: string;
  nome: string;
}



export const useCadastroCliente = () => {
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<Cliente>({
    CPF: '',
    Nome: '',
    Email: '',
    Telefone: '',
    Senha: '',
    SalaoId: '',
  });

  // Estado para exibir/ocultar senha
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Estado para mensagem de sucesso/erro
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Lista mock de salões (em produção viria de uma API)
  const [saloes] = useState<SalaoType[]>([
    { CNPJ: '12345678000190', nome: 'Salão Beleza Total' },
    { CNPJ: '98765432000190', nome: 'Estética Perfeita' },
    { CNPJ: '45678912000190', nome: 'Estilo e Elegância' },
  ]);

  // Validações
  const [errors, setErrors] = useState<Partial<Cliente>>({});

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpa erro quando o usuário corrige o campo
    if (errors[name as keyof Cliente]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSalaoChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      SalaoId: e.target.value,
    });
    
    if (errors.SalaoId) {
      setErrors({
        ...errors,
        SalaoId: undefined,
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Formatação de CPF durante digitação
  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 11);
  };

  // Formatação de telefone durante digitação
  const formatTelefone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, CPF: formatted });
    
    if (errors.CPF) {
      setErrors({
        ...errors,
        CPF: undefined,
      });
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setFormData({ ...formData, Telefone: formatted });
    
    if (errors.Telefone) {
      setErrors({
        ...errors,
        Telefone: undefined,
      });
    }
  };

  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors: Partial<Cliente> = {};
    
    // Validar CPF (formato básico)
    if (!formData.CPF || !/^\d{11}$/.test(formData.CPF)) {
      newErrors.CPF = 'CPF inválido. Deve conter 11 dígitos numéricos.';
    }
    
    // Validar Nome
    if (!formData.Nome || formData.Nome.trim().length < 3) {
      newErrors.Nome = 'Nome inválido. Mínimo de 3 caracteres.';
    }
    
    // Validar Email
    if (!formData.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = 'Email inválido.';
    }
    
    // Validar Telefone
    if (!formData.Telefone || !/^\d{10,11}$/.test(formData.Telefone.replace(/\D/g, ''))) {
      newErrors.Telefone = 'Telefone inválido. Deve conter 10 ou 11 dígitos.';
    }
    
    // Validar Senha
    if (!formData.Senha || formData.Senha.length < 6) {
      newErrors.Senha = 'Senha muito curta. Mínimo de 6 caracteres.';
    }
    
    // Validar SalaoId
    if (!formData.SalaoId) {
      newErrors.SalaoId = 'Selecione um salão.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Utiliza o serviço de API para cadastrar o cliente
        await cadastrarCliente.create(formData);
        
        setSnackbar({
          open: true,
          message: 'Cliente cadastrado com sucesso!',
          severity: 'success'
        });
        
        // Limpar formulário após sucesso
        setFormData({
          CPF: '',
          Nome: '',
          Email: '',
          Telefone: '',
          Senha: '',
          SalaoId: '',
        });
        
      } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao cadastrar cliente. Tente novamente.',
          severity: 'error'
        });
      }
    } else {
      console.log('Formulário com erros:', errors);
    }
  };

  return {
    formData,
    errors,
    saloes,
    showPassword,
    snackbar,
    handleInputChange,
    handleSalaoChange,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleCloseSnackbar,
    handleSubmit,
    handleCPFChange,
    handleTelefoneChange
  };
};