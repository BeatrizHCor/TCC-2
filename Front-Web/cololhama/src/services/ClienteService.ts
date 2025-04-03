import axios from 'axios';
import { Cliente } from '../models/clienteModel';
import { AuthControl } from '../models/authModel';
import { NovoClienteDTO } from '../models/NovoClienteDTO';

const api = axios.create({
  baseURL: 'http://localhost:3001/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const ClienteService = {
  async cadastrarCliente(cliente: Cliente): Promise<Cliente> {
    try {
         const novoCliente: NovoClienteDTO = {
              CPF: cliente.CPF,
              Nome: cliente.Nome,
              Email: cliente.Email,
              Telefone: String(cliente.Telefone), 
              SalaoId: cliente.SalaoId,
            };
      const response = await api.post('/cliente', novoCliente);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      throw error;
    }
  },

  async verificarClienteEmailExistente(email: string, salaoId: string): Promise<boolean> {
    try {
      const response = await api.get(`/cliente/${email}/${salaoId}`);
      return !!response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      console.error('Erro ao verificar cliente:', error);
      throw error;
    }
  },

  async verificarClienteCpfExistente(cpf: string, salaoId: string): Promise<boolean> {
    try {
      const response = await api.get(`/cliente/${cpf}/${salaoId}`);
      return !!response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      console.error('Erro ao verificar cliente por CPF:', error);
      throw error;
    }
  }
};

export default ClienteService;