import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userTypes } from '../../models/tipo-usuario.enum';
import { ClienteService } from '../../services/ClienteService';
import { cpfMask, telefoneMask, validarCPF, validarEmail, validarSenha, validarTelefone } from '../../utils/validations';

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
    CPF: '',
    nome: '',
    email: '',
    telefone: '',
    salaoId: salaoId,
    password: '',
    userType: userTypes.CLIENTE,
  });

  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [cpfFormatado, setCpfFormatado] = useState('');
  const [telefoneFormatado, setTelefoneFormatado] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCadastro(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = cpfMask(e.target.value);
    setCpfFormatado(maskedValue);

    const numericValue = maskedValue.replace(/\D/g, '');
    setCadastro(prev => ({ ...prev, CPF: numericValue }));

    if (errors.CPF) {
      setErrors(prev => ({ ...prev, CPF: undefined }));
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = telefoneMask(e.target.value);
    setTelefoneFormatado(maskedValue);

    const numericValue = Number(maskedValue.replace(/\D/g, ''));
    setCadastro(prev => ({ ...prev, telefone: numericValue.toString() }));

    if (errors.telefone) {
      setErrors(prev => ({ ...prev, telefone: undefined }));
    }
  };
  const handleConfirmacaoSenhaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConfirmacaoSenha(value);
  };
  const validateForm = async () => {
    const newErrors: FormErrors = {};

    if (!cadastro.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!validarCPF(cadastro.CPF)) {
      newErrors.CPF = 'CPF inválido';
    } else {
      const cpfExiste = await ClienteService.getClienteByCpfAndSalao(cadastro.CPF, salaoId);
      if (cpfExiste) {
        newErrors.CPF = 'CPF já cadastrado';
      }
    }

    if (!validarTelefone(cadastro.telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }

    if (!cadastro.email || !validarEmail(cadastro.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!cadastro.password || !validarSenha(cadastro.password)) {
      newErrors.password = 'Senha fraca';
    }

    if (!confirmacaoSenha || confirmacaoSenha !== cadastro.password) {
      newErrors.confirmacaoSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isValid = await validateForm();

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await ClienteService.cadastrarCliente(cadastro);

      if (!response) {
        console.error("Erro ao cadastrar cliente.");
        return;
      }

      setLoading(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar: ' + JSON.stringify(error));
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
    saveSuccess,
    setSaveSuccess,
    handleChange,
    handleCPFChange,
    handleTelefoneChange,
    handleSubmit,
    handleConfirmacaoSenhaChange,
    setCadastro,
    setConfirmacaoSenha,
    setErrors,
    setTelefoneFormatado,
  };
};