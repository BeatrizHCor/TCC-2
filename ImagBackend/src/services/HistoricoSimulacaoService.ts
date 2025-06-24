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
                return null;
            }

            const imagemComConteudo = historicoSimulacao.Imagem.map(
                (imagem) => {
                    try {
                        // CORREÇÃO: Usar path absoluto baseado no diretório do projeto
                        const uploadsDir = path.join(process.cwd(), 'uploads');
                        const filePath = path.join(uploadsDir, imagem.Endereco.replace('/uploads/', ''));
                        
                        if (fs.existsSync(filePath)) {
                            const fileStat = fs.statSync(filePath);
                            const fileSizeInBytes = fileStat.size;
                            const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
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

            const resultado = historicos.map((historico) => ({
                ID: historico.ID,
                Data: historico.Data,
                Cliente: historico.Cliente,
                Salao: historico.Salao,
                imagens: historico.Imagem,
            }));

            return resultado;
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

    static async salvarSimulacaoJson(
        clienteId: string,
        salaoId: string,
        corOriginal: any,
        cores: any,
        imagens: any
    ) {
        try {
            // Validações iniciais
            if (!clienteId || !salaoId) {
                throw new Error("ClienteID e SalaoID são obrigatórios");
            }

            if (!imagens || typeof imagens !== 'object') {
                throw new Error("Dados de imagens são obrigatórios");
            }

            console.log("🚀 Iniciando salvamento da simulação...");
            console.log("📋 Dados recebidos:", {
                clienteId,
                salaoId,
                temImagens: !!imagens,
                tiposImagem: Object.keys(imagens || {})
            });

            const novoHistorico = await prisma.historicoSimulacao.create({
                data: {
                    ClienteID: clienteId,
                    SalaoId: salaoId,
                    Data: new Date(),
                },
            });

            console.log("✅ Histórico criado com ID:", novoHistorico.ID);

            const historicoId = novoHistorico.ID;
            
            // CORREÇÃO: Usar path absoluto baseado no diretório do projeto
            const uploadsBaseDir = path.join(process.cwd(), 'uploads', 'simulacoes');
            const baseDir = path.join(uploadsBaseDir, historicoId.toString());
            
            // Garantir que o diretório existe
            if (!fs.existsSync(uploadsBaseDir)) {
                fs.mkdirSync(uploadsBaseDir, { recursive: true });
                console.log("📁 Diretório uploads/simulacoes criado");
            }
            
            if (!fs.existsSync(baseDir)) {
                fs.mkdirSync(baseDir, { recursive: true });
                console.log("📁 Diretório específico criado:", baseDir);
            }

            const imagensASalvar = [
                { base64: imagens.original, desc: "Imagem Original", tipo: "Analoga" },
                { base64: imagens.analoga_1, desc: "Cor Análoga 1", tipo: "Analoga" },
                { base64: imagens.analoga_2, desc: "Cor Análoga 2", tipo: "Analoga2" },
                { base64: imagens.complementar, desc: "Cor Complementar", tipo: "Complementar" },
            ];

            console.log("🖼️ Processando", imagensASalvar.length, "imagens...");

            for (let i = 0; i < imagensASalvar.length; i++) {
                const img = imagensASalvar[i];
                
                console.log(`📸 Processando imagem ${i + 1}:`, img.desc);

                if (!img.base64) {
                    console.warn(`⚠️ Imagem ${img.desc} está vazia, pulando...`);
                    continue;
                }

                // Limpar o prefixo data:image se existir
                let base64Data = img.base64;
                if (base64Data.includes(',')) {
                    base64Data = base64Data.split(',')[1];
                }

                if (!base64Data || base64Data.length < 50) {
                    console.warn(`⚠️ Imagem ${img.desc} muito pequena ou inválida, pulando...`);
                    continue;
                }

                try {
                    const buffer = Buffer.from(base64Data, "base64");
                    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
                    const filepath = path.join(baseDir, filename);
                    
                    // CORREÇÃO: Salvar apenas o path relativo no banco
                    const relativePath = `/uploads/simulacoes/${historicoId}/${filename}`;

                    console.log(`💾 Salvando arquivo: ${filename}`);
                    console.log(`📍 Path completo: ${filepath}`);
                    console.log(`🔗 Path relativo: ${relativePath}`);

                    fs.writeFileSync(filepath, buffer);

                    await prisma.imagem.create({
                        data: {
                            HistoricoSimulacaoId: historicoId,
                            Endereco: relativePath, // CORREÇÃO: Salvar path relativo
                            Descricao: img.desc,
                            Tipo: img.tipo as "Analoga" | "Analoga2" | "Complementar",
                        },
                    });

                    console.log(`✅ Imagem ${img.desc} salva com sucesso`);

                } catch (imgError) {
                    console.error(`❌ Erro ao processar imagem ${img.desc}:`, imgError);
                    // Continuar com as outras imagens mesmo se uma falhar
                    continue;
                }
            }

            console.log("🎉 Simulação salva com sucesso!");

            return {
                historicoId,
                message: "Simulação salva com sucesso.",
                success: true
            };

        } catch (error: any) {
            console.error("❌ Erro ao salvar simulação JSON:", error);
            console.error("📋 Stack trace:", error.stack);
            
            // Melhor tratamento de erro
            if (error.code === 'P2002') {
                throw new Error("Erro de duplicação no banco de dados");
            } else if (error.code === 'ENOENT') {
                throw new Error("Erro ao criar diretório de upload");
            } else if (error.code === 'EACCES') {
                throw new Error("Erro de permissão ao salvar arquivo");
            } else {
                throw new Error(`Erro interno: ${error.message}`);
            }
        }
    }
}

export default HistoricoSimulacaoService;