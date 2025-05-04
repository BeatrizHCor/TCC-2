import { useState, useEffect } from 'react';
import { ClienteService } from '../../services/ClienteService';
import { cpfMask, telefoneMask, validarEmail, validarSenha, validarTelefone } from '../../utils/validations';

interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  password?: string;
  confirmacaoSenha?: string;
}

interface ClienteData {
  CPF: string;
  nome: string;
  email: string;
  telefone: string;
  salaoId: string;
  password: string;
  userType: string;
}

export const usePerfilCliente = (salaoId: string) => {
  const [perfil, setPerfil] = useState<ClienteData>({
    CPF: '',
    nome: '',
    email: '',
    telefone: '',
    salaoId: salaoId,
    password: '',
    userType: '',
  });

  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [cpfFormatado, setCpfFormatado] = useState('');
  const [telefoneFormatado, setTelefoneFormatado] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      setLoading(true);
      try {
        // Simulando a resposta da API para carregar o perfil
        const clienteData = {
          CPF: '123.456.789-00',
          nome: 'Fulaninha Banana',
          email: 'email@email.com',
          telefone: '11987654321',
          salaoId: salaoId,
          password: 'Senha123*',
          userType: 'cliente',
        };

        if (clienteData) {
          setPerfil(clienteData);
          setCpfFormatado(cpfMask(clienteData.CPF));
          setTelefoneFormatado(telefoneMask(clienteData.telefone));
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    fetchPerfil();
  }, [salaoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfil(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = telefoneMask(e.target.value);
    setTelefoneFormatado(maskedValue);

    const numericValue = maskedValue.replace(/\D/g, '');
    setPerfil(prev => ({ ...prev, telefone: numericValue }));

    if (errors.telefone) {
      setErrors(prev => ({ ...prev, telefone: undefined }));
    }
  };

  const handleConfirmacaoSenhaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConfirmacaoSenha(value);

    if (errors.confirmacaoSenha) {
      setErrors(prev => ({ ...prev, confirmacaoSenha: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!perfil.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!validarTelefone(perfil.telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }

    if (!perfil.email || !validarEmail(perfil.email)) {
      newErrors.email = 'Email inválido';
    }

    if (perfil.password) {
      if (!validarSenha(perfil.password)) {
        newErrors.password = 'Senha fraca';
      }

      if (!confirmacaoSenha || confirmacaoSenha !== perfil.password) {
        newErrors.confirmacaoSenha = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isValid = validateForm();

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      // Simulando a resposta da API para atualizar o perfil
      const response = { success: true };

      if (!response.success) {
        console.error("Erro ao atualizar perfil.");
        return;
      }

      setSaveSuccess(true);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil: ' + JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    perfil,
    setPerfil,
    cpfFormatado,
    telefoneFormatado,
    setTelefoneFormatado,
    confirmacaoSenha,
    setConfirmacaoSenha,
    errors,
    setErrors,
    loading,
    saveSuccess,
    setSaveSuccess,
    isInitialized,
    handleChange,
    handleTelefoneChange,
    handleSubmit,
    handleConfirmacaoSenhaChange,
  };
};
