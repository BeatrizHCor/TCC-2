import ClienteModel from '../models/clienteModel';
import { Prisma } from '@prisma/client';

interface ClienteData {
  CPF: string;
  Nome: string;
  Email: string;
  Telefone: string;
  Senha: string;
  SalaoId: string;
}

class ClienteService {
  static async findAll(page = 1, limit = 10, includeRelations = false) {
    const skip = (page - 1) * limit;
    
    const [total, clientes] = await Promise.all([
      ClienteModel.findMany(),
      ClienteModel.findMany(includeRelations)
    ]);

    return {
      total: total.length,
      page,
      limit,
      data: clientes
    };
  }

  // Criar novo cliente com validações
  static async create(data: ClienteData) {
    this.validateClienteData(data);

    // Verificar se cliente já existe
    const existingCliente = await ClienteModel.findByCPFandSalao(data.CPF, data.SalaoId);
    if (existingCliente) {
      throw new Error('Cliente já cadastrado neste salão');
    }

    // Aqui você pode adicionar lógica de hash de senha
    // const hashedSenha = await hashPassword(data.Senha);

    return ClienteModel.create({
      ...data,
      // Senha: hashedSenha
    });
  }

  // Buscar cliente por CPF e Salão
  static async findByCPFandSalao(cpf: string, salaoId: string, includeRelations = false) {
    const cliente = await ClienteModel.findByCPFandSalao(cpf, salaoId, includeRelations);
    
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    return cliente;
  }

  // Buscar cliente por email
  static async findByEmail(email: string, includeRelations = false) {
    return ClienteModel.findByEmail(email, includeRelations);
  }

  // Atualizar cliente
  static async update(cpf: string, salaoId: string, data: Partial<Omit<ClienteData, 'CPF' | 'SalaoId'>>) {
    // Verificar se cliente existe
    await this.findByCPFandSalao(cpf, salaoId);

    // Validações para campos de atualização
    this.validateUpdateData(data);

    // Atualizar cliente
    return ClienteModel.update(cpf, salaoId, data);
  }

  // Deletar cliente
  static async delete(cpf: string, salaoId: string) {
    // Verificar se cliente existe antes de deletar
    await this.findByCPFandSalao(cpf, salaoId);

    return ClienteModel.delete(cpf, salaoId);
  }

  // Validações
  private static validateClienteData(data: ClienteData) {
    const { CPF, Nome, Email, Telefone, Senha, SalaoId } = data;

    if (!CPF) throw new Error('CPF é obrigatório');
    if (!Nome) throw new Error('Nome é obrigatório');
    if (!Email) throw new Error('Email é obrigatório');
    if (!Telefone) throw new Error('Telefone é obrigatório');
    if (!Senha) throw new Error('Senha é obrigatória');
    if (!SalaoId) throw new Error('SalaoId é obrigatório');

  }

  private static validateUpdateData(data: Partial<Omit<ClienteData, 'CPF' | 'SalaoId'>>) {
    // Verificar se pelo menos um campo foi fornecido para atualização
    if (Object.keys(data).length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    // Validações específicas para campos de atualização
    if (data.Email && !this.isValidEmail(data.Email)) {
      throw new Error('Email inválido');
    }
  }


  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default ClienteService;