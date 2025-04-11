import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthControl } from "../../models/authModel";
import { userTypes } from "../../models/tipo-usuario.enum";
import { LoginService } from "../../services/LoginService";

interface FormErrors {
  email?: string;
  senha?: string;
}

export const useClienteLogin = (salaoId: string) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState<AuthControl>({
    email: "",
    senha: "",
    salaoId: salaoId,
    type: userTypes.Cliente,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuth((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Evento para validar email assim que a pessoa clicar fora do campo
  const handleEmailBlur = () => {
    if (!validateEmail(auth.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Formato de email inválido",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!auth.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(auth.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!auth.senha) {
      newErrors.senha = "Senha é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isValid = validateForm();
      if (!isValid) {
        setLoading(false);
        return;
      }

      await LoginService.login(auth.email, auth.senha, auth.salaoId);
      navigate("/");
    } catch (error) {
      setErrors({ senha: "Email ou senha inválidos" });
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    auth,
    errors,
    loading,
    handleChange,
    handleEmailBlur, 
    handleSubmit,
  };
};
