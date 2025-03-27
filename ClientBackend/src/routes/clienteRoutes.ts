import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// [GET] Buscar todos os clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany({
            include: {
                Salao: true,
                Agendamentos: true,
                HistoricoSimulacao: true
            }
        });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar clientes', details: (error as Error).message });
    }
});

// [GET] Buscar um cliente por CPF
/*
router.get('/:cpf', async (req, res) => {
    const cpf = req.params.cpf;

    try {
        const cliente = await prisma.cliente.findFirst({ 
            where: { 
                CPF: cpf,
            },
            include: {
                Salao: true,
                Agendamentos: true,
                HistoricoSimulacao: true
            }
        });

        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

        res.json(cliente);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
      
            res.status(400).json({ 
                error: 'Erro ao buscar cliente', 
                details: error.message 
            });
        } else {
            res.status(500).json({ 
                error: 'Erro interno do servidor', 
                details: (error as Error).message 
            });
        }
    }
});
*/
// [POST] Criar um novo cliente
router.post('/', async (req, res) => {
    const { CPF, Nome, Email, Telefone, Senha, SalaoId } = req.body;

    try {
        const newCliente = await prisma.cliente.create({
            data: { 
                CPF, 
                Nome, 
                Email, 
                Telefone, 
                Senha, 
                SalaoId 
            },
        });
        res.status(201).json(newCliente);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar cliente', details: (error as Error).message });
    }
});

// [PUT] Atualizar um cliente
router.put('/:cpf/:salaoId', async (req, res) => {
    const { cpf, salaoId } = req.params;
    const { Nome, Email, Telefone, Senha } = req.body;

    try {
        const updatedCliente = await prisma.cliente.update({
            where: { 
                CPF_SalaoId: {
                    CPF: cpf,
                    SalaoId: salaoId
                }
            },
            data: { Nome, Email, Telefone, Senha },
        });
        res.json(updatedCliente);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar cliente', details: (error as Error).message });
    }
});

// [DELETE] Remover um cliente
router.delete('/:cpf/:salaoId', async (req, res) => {
    const { cpf, salaoId } = req.params;

    try {
        await prisma.cliente.delete({ 
            where: { 
                CPF_SalaoId: {
                    CPF: cpf,
                    SalaoId: salaoId
                }
            } 
        });
        res.json({ message: 'Cliente removido com sucesso' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao remover cliente', details: (error as Error).message });
    }
});

export default router;