import prisma from "../config/database";
import fs from "fs";
import path from "path";

class HistoricoSimulacaoService {
    static async createHistoricoSimulacao(
        ClienteID: string,
        SalaoId: string,
        imagemFile: {
            filename: string;
            path: string;
        },
        descricaoImagem: string,
        tipoImagem: "Analoga" | "Analoga2" | "Complementar",
    ) {
        try {

            const historicoSimulacao = await prisma.historicoSimulacao.create({
                data: {
                    Data: new Date(),
                    ClienteID,
                    SalaoId,
                },
            });

            const imagem = await prisma.imagem.create({
                data: {
                    HistoricoSimulacaoId: historicoSimulacao.ID,
                    Endereco: imagemFile.path,
                    Descricao: descricaoImagem,
                    Tipo: tipoImagem,
                },
            });

            return {
                ...historicoSimulacao,
                Imagem: [imagem],
            };
        } catch (error) {
            console.error("Erro ao criar histórico de simulação:", error);
            throw error;
        }
    }

    static async getHistoricoSimulacaoById(id: string) {
        try {
            const historicoSimulacao = await prisma.historicoSimulacao
                .findUnique({
                    where: { ID: id },
                    include: {
                        Cliente: true,
                        Salao: true,
                        Imagem: true,
                    },
                });

            if (!historicoSimulacao) {
                console.log("Histórico de simulação não encontrado.");
                return null;
            }

            const imagemComConteudo = historicoSimulacao.Imagem.map(
                (imagem) => {
                    try {
                        const filePath = path.normalize(
                            path.join(__dirname, "..", "..", imagem.Endereco),
                        );
                        if (fs.existsSync(filePath)) {
                            const fileStat = fs.statSync(filePath);
                            const fileSizeInBytes = fileStat.size;
                            const fileSizeInMB = fileSizeInBytes /
                                (1024 * 1024);
                            const fileContent = fs.readFileSync(filePath, {
                                encoding: "base64",
                            });
                            return {
                                ...imagem,
                                fileSize: fileSizeInMB,
                                fileContent: fileContent,
                            };
                        }
                        return {
                            ...imagem,
                            fileSize: null,
                            fileContent: null,
                        };
                    } catch (err) {
                        console.error(
                            `Erro ao processar arquivo ${imagem.Endereco}:`,
                            err,
                        );
                        return {
                            ...imagem,
                            fileSize: null,
                            fileContent: null,
                        };
                    }
                },
            );

            return {
                ID: historicoSimulacao.ID,
                Data: historicoSimulacao.Data,
                Cliente: historicoSimulacao.Cliente,
                Salao: historicoSimulacao.Salao,
                imagens: imagemComConteudo,
            };
        } catch (error) {
            console.error(
                "Erro ao buscar histórico de simulação por ID:",
                error,
            );
            throw error;
        }
    }

    static async getAllHistoricoSimulacao(
        skip: number = 0,
        take: number = 10,
        clienteId: string | null = null,
        salaoId: string | null = null,
    ) {
        try {
            const whereClause: any = {};
            if (clienteId) whereClause.ClienteID = clienteId;
            if (salaoId) whereClause.SalaoId = salaoId;

            const historicos = await prisma.historicoSimulacao.findMany({
                skip: skip,
                take: take,
                where: Object.keys(whereClause).length > 0
                    ? whereClause
                    : undefined,
                include: {
                    Cliente: true,
                    Salao: true,
                    Imagem: true,
                },
                orderBy: {
                    Data: "desc",
                },
            });

            console.log(
                "Históricos de simulação encontrados:",
                historicos.length,
            );
            return historicos;
        } catch (error) {
            console.error(
                "Erro ao buscar todos os históricos de simulação:",
                error,
            );
            throw error;
        }
    }

    static async getHistoricoSimulacaoByClienteId(clienteId: string) {
        try {
            const historicos = await prisma.historicoSimulacao.findMany({
                where: {
                    ClienteID: clienteId,
                },
                include: {
                    Cliente: true,
                    Salao: true,
                    Imagem: true,
                },
                orderBy: {
                    Data: "desc",
                },
            });

            return historicos.map((historico) => ({
                ID: historico.ID,
                Data: historico.Data,
                Cliente: historico.Cliente,
                Salao: historico.Salao,
                imagens: historico.Imagem,
            }));
        } catch (error) {
            console.error(
                "Erro ao buscar histórico de simulação por cliente:",
                error,
            );
            throw error;
        }
    }

    static async deleteHistoricoSimulacao(id: string) {
        try {
            const historicoSimulacao = await prisma.historicoSimulacao.delete({
                where: { ID: id },
            });
            if (historicoSimulacao) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Erro ao deletar histórico de simulação:", error);
            throw error;
        }
    }

    static async updateHistoricoSimulacao(id: string, descricaoImagem: string) {
        try {
            const imagem = await prisma.imagem.findFirst({
                where: { HistoricoSimulacaoId: id },
            });

            if (!imagem) {
                throw new Error("Imagem associada ao histórico não encontrada");
            }

            const imagemAtualizada = await prisma.imagem.update({
                where: { ID: imagem.ID },
                data: {
                    Descricao: descricaoImagem,
                },
            });
            const historicoAtualizado = await prisma.historicoSimulacao
                .findUnique({
                    where: { ID: id },
                    include: {
                        Cliente: true,
                        Salao: true,
                        Imagem: true,
                    },
                });

            return historicoAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar histórico de simulação:", error);
            throw error;
        }
    }
}

export default HistoricoSimulacaoService;
