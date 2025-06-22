import { Request, Response } from "express";
import HistoricoSimulacaoService from "../services/HistoricoSimulacaoService";

export class HistoricoSimulacaoController {
    static async createHistoricoSimulacao(req: Request, res: Response): Promise<void> {
        try {
            const { ClienteId, SalaoId, descricaoImagem, tipoImagem } = req.body;
            
            if (!ClienteId || !SalaoId || !descricaoImagem || !tipoImagem) {
                res.status(400).json({ 
                    error: "ClienteId, SalaoId, descricaoImagem e tipoImagem são obrigatórios." 
                });
                return;
            }

            if (!["Analoga", "Analoga2", "Complementar"].includes(tipoImagem)) {
                res.status(400).json({ 
                    error: "tipoImagem deve ser: Analoga, Analoga2 ou Complementar." 
                });
                return;
            }

            if (!req.file) {
                res.status(400).json({ error: "Arquivo de imagem é obrigatório." });
                return;
            }

            const imagemFile = {
                filename: req.file.filename,
                path: req.file.path,
            };

            const historicoSimulacao = await HistoricoSimulacaoService.createHistoricoSimulacao(
                ClienteId,
                SalaoId,
                imagemFile,
                descricaoImagem,
                tipoImagem
            );

            res.status(201).json(historicoSimulacao);
        } catch (error) {
            console.error("Erro ao criar histórico de simulação:", error);
            res.status(500).json({ error: "Erro interno ao criar histórico de simulação." });
        }
    }

    static async getHistoricoSimulacaoById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const historicoSimulacao = await HistoricoSimulacaoService.getHistoricoSimulacaoById(id);
            
            if (!historicoSimulacao) {
                res.status(404).json({ error: "Histórico de simulação não encontrado." });
                return;
            }
            
            res.status(200).json(historicoSimulacao);
        } catch (error) {
            console.error("Erro ao buscar histórico de simulação por ID:", error);
            res.status(500).json({ error: "Erro interno ao buscar histórico de simulação." });
        }
    }

    static async getAllHistoricoSimulacao(req: Request, res: Response): Promise<void> {
        try {
            const { skip, take, clienteId, salaoId } = req.query;
            
            const historicos = await HistoricoSimulacaoService.getAllHistoricoSimulacao(
                Number(skip) || 0,
                Number(take) || 10,
                clienteId ? String(clienteId) : null,
                salaoId ? String(salaoId) : null
            );
            
            res.status(200).json(historicos);
        } catch (error) {
            console.error("Erro ao buscar históricos de simulação:", error);
            res.status(500).json({ error: "Erro interno ao buscar históricos de simulação." });
        }
    }

  /*  static async getHistoricoSimulacaoByCliente(req: Request, res: Response): Promise<void> {
        try {
            const { clienteId } = req.params;
            
            if (!clienteId) {
                res.status(400).json({ error: "ClienteId é obrigatório." });
                return;
            }
            
            const historicos = await HistoricoSimulacaoService.getHistoricoSimulacaoByClienteId(clienteId);
            
            if (historicos && historicos.length > 0) {
                res.status(200).json(historicos);
            } else {
                res.status(204).send();
            }
        } catch (error) {
            console.error("Erro ao buscar históricos de simulação por cliente:", error);
            res.status(500).json({ error: "Erro interno ao buscar históricos de simulação." });
        }
    }*/

    static async deleteHistoricoSimulacao(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const deletedHistorico = await HistoricoSimulacaoService.deleteHistoricoSimulacao(id);
            
            if (!deletedHistorico) {
                res.status(404).json({ error: "Histórico de simulação não encontrado." });
                return;
            }
            
            res.status(200).json({ message: "Histórico de simulação deletado com sucesso." });
        } catch (error) {
            console.error("Erro ao deletar histórico de simulação:", error);
            res.status(500).json({ error: "Erro interno ao deletar histórico de simulação." });
        }
    }

    static async updateHistoricoSimulacao(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { descricaoImagem } = req.body;
            
            if (!descricaoImagem) {
                res.status(400).json({ error: "descricaoImagem é obrigatória." });
                return;
            }
            
            const historicoAtualizado = await HistoricoSimulacaoService.updateHistoricoSimulacao(
                id,
                descricaoImagem
            );
            
            if (!historicoAtualizado) {
                res.status(404).json({ error: "Histórico de simulação não encontrado." });
                return;
            }
            
            res.status(200).json(historicoAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar histórico de simulação:", error);
            res.status(500).json({ error: "Erro interno ao atualizar histórico de simulação." });
        }
    }

    static async salvarSimulacaoJson(req: Request, res: Response): Promise<void> {
        try {
            const { clienteId, salaoId, corOriginal, cores, imagens } = req.body;

            if (!clienteId || !salaoId || !corOriginal || !cores || !imagens) {
                res.status(400).json({ error: "Dados incompletos." });
                return;
            }

            const simulacaoSalva = await HistoricoSimulacaoService.salvarSimulacaoJson(
                clienteId,
                salaoId,
                corOriginal,
                cores,
                imagens
            );

            res.status(201).json(simulacaoSalva);
        } catch (error) {
            console.error("Erro ao salvar simulação JSON:", error);
            res.status(500).json({ error: "Erro interno ao salvar simulação." });
        }
    }


static async getHistoricoSimulacaoByCliente(req: Request, res: Response): Promise<void> {
        try {
            const { clienteId } = req.params;
            
            console.log("🔍 Controller - getHistoricoSimulacaoByCliente chamado com clienteId:", clienteId);

            if (!clienteId) {
                console.log("❌ Controller - ClienteId não fornecido");
                res.status(400).json({ 
                    success: false, 
                    error: "ClienteId é obrigatório." 
                });
                return;
            }

            console.log("📞 Controller - Chamando Service.getHistoricoSimulacaoByClienteId...");
            
            // Chama o método correto do Service
            const historicos = await HistoricoSimulacaoService.getHistoricoSimulacaoByClienteId(clienteId);
            
            console.log("📊 Controller - Resultado recebido do Service:");
            console.log("- Quantidade encontrada:", historicos?.length || 0);
            console.log("- Tipo do resultado:", typeof historicos);
            console.log("- É array?", Array.isArray(historicos));
            
            if (historicos && historicos.length > 0) {
                console.log("- IDs dos históricos:", historicos.map(h => h.ID));
                console.log("- Datas dos históricos:", historicos.map(h => h.Data));
            }

            const response = {
                success: true,
                data: historicos || []
            };

            console.log("📤 Controller - Enviando resposta final:");
            console.log("- success:", response.success);
            console.log("- data.length:", response.data.length);
            console.log("- response completo:", JSON.stringify(response, null, 2));

            res.status(200).json(response);
        } catch (error) {
            console.error("❌ Controller - Erro ao buscar históricos de simulação por cliente:", error);
            res.status(500).json({ 
                success: false, 
                error: "Erro interno ao buscar históricos de simulação." 
            });
        }
    }

}

export default HistoricoSimulacaoController;