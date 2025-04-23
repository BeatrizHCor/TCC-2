import { Request, Response } from 'express';
import ClienteController from './clienteController';
import ClienteService  from "../services/clienteService";
import axios from 'axios';

const AuthBack = process.env.AUTH_BACK_URL || 'http://localhost:3000';

class OrquestradorClienteAuth {
    static async create(req: Request, res: Response): Promise<void> {
        let clienteId: string | null = null;
        let { Email, SalaoId } = req.body;
        try {
            // cria um cliente
            const clienteResponse = await ClienteController.create(req);
            if (!clienteResponse) {
                res.status(400).json({ message: 'Erro ao criar cliente.' });
            }
            // extrai ID
            const clienteData = await ClienteService.findByEmailandSalao(Email, SalaoId);
            if (!clienteData) {
                 res.status(404).json({ message: 'Cliente não encontrado.' });
            }     
            else {
                clienteId = clienteData.ID;            
                const authUrl = `${AuthBack}/register`;
                            
            //criar um login no AuthBackend
            const authResponse = await axios.post(authUrl, {
                userID: clienteData.ID,
                email: clienteData.Email,
                password: req.body.password,
                salaoID: clienteData.SalaoId,
                userType: 'Cliente',                
            });
        
                res.status(201).json({
                message: 'Cliente e login criados com sucesso.',
                cliente: clienteData,
                auth: authResponse.data,
            });
            }
        } catch (error: any) {
            // Se já tiver criado o cliente mas o login falhar, exclui o cliente
            if (clienteId) {
                try {
                    const DeleteRequest = {
                        params: { email: req.body.Email, salaoId: req.body.SalaoId },
                    } as unknown as Request;
                    ClienteController.delete(DeleteRequest, res);
                    console.log(`Cliente ${clienteId} excluído após falha na criação do login.`);
                } catch (deleteError) {
                    console.error('Erro ao excluir cliente após falha no login:', deleteError);
                }
            }
            
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status || 500;
                const errorMessage = error.response?.data?.message || 'Erro na comunicação com o serviço de autenticação.';
                
                    res.status(statusCode).json({ 
                    message: errorMessage,
                    error: error.message
                });
            }
            
            console.error('Erro no OrquestradorClienteAuth:', error);
            res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }
}

export default OrquestradorClienteAuth;