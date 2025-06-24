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

    static async deleteHistoricoSimulacao(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "ID do histórico é obrigatório."
                });
                return;
            }

            console.log(' Solicitação de exclusão para histórico: ${id}');

            const historicoExiste = await HistoricoSimulacaoService.getHistoricoSimulacaoById(id);

            if (!historicoExiste) {
                res.status(404).json({
                    success: false,
                    error: "Histórico de simulação não encontrado."
                });
                return;
            }

            const deletedHistorico = await HistoricoSimulacaoService.deleteHistoricoSimulacao(id);

            if (!deletedHistorico) {
                res.status(500).json({
                    success: false,
                    error: "Erro ao deletar histórico de simulação."
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Histórico de simulação deletado com sucesso.",
                historicoId: id
            });

        } catch (error: any) {
            console.error("Erro ao deletar histórico de simulação:", error);

            if (error.message?.includes("não encontrada")) {
                res.status(404).json({
                    success: false,
                    error: "Simulação não encontrada para exclusão."
                });
            } else if (error.message?.includes("dependências")) {
                res.status(409).json({
                    success: false,
                    error: "Não é possível deletar: existem dependências."
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: "Erro interno ao deletar histórico de simulação.",
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
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

            if (!clienteId) {
                res.status(400).json({
                    success: false,
                    error: "ClienteId é obrigatório."
                });
                return;
            }

            const historicos = await HistoricoSimulacaoService.getHistoricoSimulacaoByClienteId(clienteId);

            const response = {
                success: true,
                data: historicos || []
            };

            res.status(200).json(response);
        } catch (error) {
            console.error("Erro ao buscar históricos de simulação por cliente:", error);
            res.status(500).json({
                success: false,
                error: "Erro interno ao buscar históricos de simulação."
            });
        }
    }
}

export default HistoricoSimulacaoController;