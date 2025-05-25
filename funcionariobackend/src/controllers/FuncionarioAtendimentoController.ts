import { Request, Response } from "express";
import AtendimentoService from "../services/FuncionarioAtendimentoService";

class AtendimentoController {
    static async getAtendimentosPage(req: Request, res: Response) {
        try {
            const {
                page = 1,
                limit = 10,
                includeRelations = false,
                SalaoId = null,
                nomeCliente = null,
                nomeCabeleireiro = null,
                dia = 0,
                mes = 0,
                ano = 0
            } = req.query;

            const Atendimentos = await AtendimentoService.getAtendimentosPage(
                Number(page),
                Number(limit),
                includeRelations === "true",
                SalaoId ? String(SalaoId) : null,
                nomeCliente ? String(nomeCliente) : null,
                nomeCabeleireiro ? String(nomeCabeleireiro) : null,
                Number(dia),
                Number(mes),
                Number(ano)
            );

            res.json(Atendimentos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao buscar atendimentos" });
        }
    }
    static async createAtendimento(req: Request, res: Response) {
        try {
            const atendimento = await AtendimentoService.createAtendimento(req.body);
            res.status(201).json(atendimento);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao criar atendimento" });
        }
    }

    static async findById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const includeRelations = req.query.includeRelations === "true";
            const atendimento = await AtendimentoService.findById(id, includeRelations);
            if (!atendimento) {
                res.status(204).json({ message: "Atendimento não encontrado" });
            }
            res.json(atendimento);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao buscar atendimento" });
        }
    }

    static async updateAtendimento(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const atendimento = await AtendimentoService.updateAtendimento(id, req.body);
            res.json(atendimento);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao atualizar atendimento" });
        }
    }

    static async deleteAtendimento(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await AtendimentoService.deleteAtendimento(id);
            res.json(deleted);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao deletar atendimento" });
        }
    }

}


export default AtendimentoController;