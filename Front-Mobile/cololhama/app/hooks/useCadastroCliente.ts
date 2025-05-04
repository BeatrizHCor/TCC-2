// app/useCadastroCliente.ts
import { useState } from 'react';
import { Alert } from 'react-native';

export const useClienteCadastro = (salaoId: string) => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmacaoSenha: '',
    cpf: '',
    telefone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Format CPF: 123.456.789-00
  const formatCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, ''); // Remove non-numeric characters
    if (cpf.length <= 3) return cpf;
    if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  };

  // Format phone: (99) 99999-9999
  const formatTelefone = (telefone: string) => {
    telefone = telefone.replace(/\D/g, ''); // Remove non-numeric characters
    if (telefone.length <= 2) return telefone;
    if (telefone.length <= 7) return `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7)}`;
  };

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCPFChange = (value: string) => {
    const formattedCPF = formatCPF(value);
    setForm(prev => ({ ...prev, cpf: formattedCPF }));
    if (errors.CPF) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.CPF;
        return newErrors;
      });
    }
  };

  const handleTelefoneChange = (value: string) => {
    const formattedTelefone = formatTelefone(value);
    setForm(prev => ({ ...prev, telefone: formattedTelefone }));
    if (errors.telefone) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.telefone;
        return newErrors;
      });
    }
  };

  const handleConfirmacaoSenhaChange = (value: string) => {
    setForm(prev => ({ ...prev, confirmacaoSenha: value }));
    if (errors.confirmacaoSenha) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.confirmacaoSenha;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate nome
    if (!form.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    
    // Validate email
    if (!form.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email inválido";
    }
    
    // Validate CPF
    const cpfNumbers = form.cpf.replace(/\D/g, '');
    if (!cpfNumbers) {
      newErrors.CPF = "CPF é obrigatório";
    } else if (cpfNumbers.length !== 11) {
      newErrors.CPF = "CPF deve ter 11 dígitos";
    }
    
    // Validate telefone
    const telefoneNumbers = form.telefone.replace(/\D/g, '');
    if (!telefoneNumbers) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (telefoneNumbers.length < 10 || telefoneNumbers.length > 11) {
      newErrors.telefone = "Telefone inválido";
    }
    
    // Validate senha
    if (!form.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (form.senha.length < 8) {
      newErrors.senha = "Senha deve ter pelo menos 8 caracteres";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(form.senha)) {
      newErrors.senha = "Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais";
    }
    
    // Validate confirmação senha
    if (form.senha !== form.confirmacaoSenha) {
      newErrors.confirmacaoSenha = "As senhas não coincidem";
    }
    
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Sucesso",
        "Cadastro realizado com sucesso!",
        [{ text: "OK" }]
      );
    }, 1500);
  };

  return {
    cpfFormatado: form.cpf,
    telefoneFormatado: form.telefone,
    confirmacaoSenha: form.confirmacaoSenha,
    errors,
    loading,
    handleChange,
    handleCPFChange,
    handleTelefoneChange,
    handleConfirmacaoSenhaChange,
    handleSubmit,
  };
};