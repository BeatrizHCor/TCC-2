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
            console.log("🔍 Service - Buscando histórico para clienteId:", clienteId);
            
            // Primeiro, vamos contar TODOS os registros na tabela
            const totalCount = await prisma.historicoSimulacao.count();
            console.log("📊 Service - TOTAL de registros na tabela historicoSimulacao:", totalCount);
            
            // Agora vamos contar quantos registros existem para este cliente específico
            const clienteCount = await prisma.historicoSimulacao.count({
                where: {
                    ClienteID: clienteId,
                },
            });
            console.log(`📊 Service - TOTAL de registros para cliente ${clienteId}:`, clienteCount);
            
            // Vamos buscar TODOS os ClienteIDs únicos para debug
            const todosClienteIds = await prisma.historicoSimulacao.findMany({
                select: {
                    ClienteID: true,
                },
                distinct: ['ClienteID'],
            });
            console.log("📊 Service - TODOS os ClienteIDs únicos na tabela:", todosClienteIds.map(h => h.ClienteID));
            
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

            console.log("📊 Service - Históricos encontrados na consulta final:", historicos.length);
            
            if (historicos.length > 0) {
                console.log("📋 Service - Primeiro registro encontrado:");
                console.log("  - ID:", historicos[0].ID);
                console.log("  - ClienteID:", historicos[0].ClienteID);
                console.log("  - Data:", historicos[0].Data);
                console.log("  - Tem Cliente?", !!historicos[0].Cliente);
                console.log("  - Tem Salao?", !!historicos[0].Salao);
                console.log("  - Quantidade de imagens:", historicos[0].Imagem?.length || 0);
            }

            const resultado = historicos.map((historico) => ({
                ID: historico.ID,
                Data: historico.Data,
                Cliente: historico.Cliente,
                Salao: historico.Salao,
                imagens: historico.Imagem,
            }));

            console.log("📤 Service - Retornando", resultado.length, "registros processados");
            return resultado;
        } catch (error) {
            console.error(
                "❌ Service - Erro ao buscar histórico de simulação por cliente:",
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

    static async salvarSimulacaoJson(
        clienteId: string,
        salaoId: string,
        corOriginal: any,
        cores: any,
        imagens: any
    ) {
        try {
            console.log("➡️ salvarSimulacaoJson iniciado");
            console.log("clienteId:", clienteId);
            console.log("salaoId:", salaoId);
            console.log("corOriginal:", corOriginal);
            console.log("cores:", cores);
            console.log("imagens recebidas:", Object.keys(imagens));

            const novoHistorico = await prisma.historicoSimulacao.create({
                data: {
                    ClienteID: clienteId,
                    SalaoId: salaoId,
                    Data: new Date(),
                },
            });

            const historicoId = novoHistorico.ID;
            const baseDir = path.join(__dirname, "../../uploads/simulacoes", historicoId.toString());
            fs.mkdirSync(baseDir, { recursive: true });

            const imagensASalvar = [
                { base64: imagens.original, desc: "Imagem Original", tipo: "Analoga" },
                { base64: imagens.analoga_1, desc: "Cor Análoga 1", tipo: "Analoga" },
                { base64: imagens.analoga_2, desc: "Cor Análoga 2", tipo: "Analoga2" },
                { base64: imagens.complementar, desc: "Cor Complementar", tipo: "Complementar" },
            ];

            for (const img of imagensASalvar) {
                console.log("🖼️ Salvando imagem:", img.desc);
                if (!img.base64 || img.base64.length < 50) {
                    throw new Error(`Imagem inválida em: ${img.desc}`);
                }

                const buffer = Buffer.from(img.base64, "base64");
                const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
                const filepath = path.join(baseDir, filename);
                const baseUrl = process.env.VITE_API_URL || 'http://localhost:3000';
                const publicUrl = `${baseUrl}/uploads/simulacoes/${historicoId}/${filename}`;
                //const publicUrl = `/uploads/simulacoes/${historicoId}/${filename}`;

                fs.writeFileSync(filepath, buffer);

                await prisma.imagem.create({
                    data: {
                        HistoricoSimulacaoId: historicoId,
                        Endereco: publicUrl,
                        Descricao: img.desc,
                        Tipo: img.tipo as "Analoga" | "Analoga2" | "Complementar",
                    },
                });
            }

            return {
                historicoId,
                message: "Simulação salva com sucesso.",
            };
        } catch (error) {
            console.error("❌ Erro ao salvar simulação JSON:", error);
            throw error;
        }
    }

    // ❌ REMOVER ESTE MÉTODO - Ele não deveria estar no Service
    // Este método está misturando responsabilidades de Controller e Service
    /*
    static async getHistoricoSimulacaoByCliente(req: Request, res: Response): Promise<void> {
        // Este método deveria estar no Controller, não no Service
    }
    */
}

export default HistoricoSimulacaoService;