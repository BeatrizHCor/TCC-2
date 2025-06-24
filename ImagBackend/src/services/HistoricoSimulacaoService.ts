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
                            'Erro ao processar arquivo ${imagem.Endereco}:',
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
            const historico = await prisma.historicoSimulacao.findUnique({
                where: { ID: id },
                include: {
                    Imagem: true,
                },
            });

            if (!historico) {
                console.log('Histórico ${id} não encontrado');
                return false;
            }

            for (const imagem of historico.Imagem) {
                try {
                    let filePath = imagem.Endereco;

                    if (!path.isAbsolute(filePath)) {
                        if (filePath.startsWith('/uploads/')) {
                            filePath = path.join(process.cwd(), filePath.substring(1)); 
                        } else if (filePath.startsWith('uploads/')) {
                            filePath = path.join(process.cwd(), filePath);
                        } else {
                            filePath = path.join(process.cwd(), 'uploads', filePath);
                        }
                    }

                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    } else {
                        console.log('Arquivo não encontrado: ${filePath}');
                    }
                } catch (fileError) {
                    console.error('Erro ao deletar arquivo ${imagem.Endereco}:', fileError);
                }
            }

            const imagensDeleted = await prisma.imagem.deleteMany({
                where: { HistoricoSimulacaoId: id },
            });

            console.log('${imagensDeleted.count} imagens deletadas do banco');

            const historicoSimulacao = await prisma.historicoSimulacao.delete({
                where: { ID: id },
            });

            try {
                const historicoDir = path.join(process.cwd(), 'uploads', 'simulacoes', id);
                if (fs.existsSync(historicoDir)) {
                    const files = fs.readdirSync(historicoDir);
                    if (files.length === 0) {
                        fs.rmdirSync(historicoDir);
                        console.log('Pasta deletada: ${historicoDir}');
                    } else {
                        console.log('Pasta não deletada (não está vazia): ${historicoDir}');
                    }
                }
            } catch (dirError) {
                console.error('Erro ao deletar pasta:', dirError);
            }

            console.log('Histórico ${id} deletado com sucesso!');
            return !!historicoSimulacao;

        } catch (error) {
            console.error("Erro ao deletar histórico de simulação:", error);

            if (error instanceof Error) {
                if (error.message.includes('P2025')) {
                    throw new Error("Simulação não encontrada para exclusão");
                } else if (error.message.includes('P2003')) {
                    throw new Error("Não é possível deletar: existem dependências");
                }
            }
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

            const uploadsBaseDir = path.join(process.cwd(), 'uploads', 'simulacoes');
            const baseDir = path.join(uploadsBaseDir, historicoId.toString());

            if (!fs.existsSync(uploadsBaseDir)) {
                fs.mkdirSync(uploadsBaseDir, { recursive: true });
                console.log(" Diretório uploads/simulacoes criado");
            }

            if (!fs.existsSync(baseDir)) {
                fs.mkdirSync(baseDir, { recursive: true });
                console.log("Diretório específico criado:", baseDir);
            }

            //arrumar quando tiver tipo original
            const imagensASalvar = [
                { base64: imagens.original, desc: "Imagem Original", tipo: "Analoga" },
                { base64: imagens.analoga_1, desc: "Cor Análoga 1", tipo: "Analoga" },
                { base64: imagens.analoga_2, desc: "Cor Análoga 2", tipo: "Analoga2" },
                { base64: imagens.complementar, desc: "Cor Complementar", tipo: "Complementar" },
            ];

            console.log("Processando", imagensASalvar.length, "imagens...");

            for (let i = 0; i < imagensASalvar.length; i++) {
                const img = imagensASalvar[i];

                console.log('📸 Processando imagem ${i + 1}:', img.desc);

                if (!img.base64) {
                    console.warn('Imagem ${img.desc} está vazia, pulando...');
                    continue;
                }

                let base64Data = img.base64;
                if (base64Data.includes(',')) {
                    base64Data = base64Data.split(',')[1];
                }

                if (!base64Data || base64Data.length < 50) {
                    console.warn('Imagem ${img.desc} muito pequena ou inválida, pulando...');
                    continue;
                }

                try {
                    const buffer = Buffer.from(base64Data, "base64");
                    const filename = '${Date.now()}-${Math.random().toString(36).slice(2)}.jpg';
                    const filepath = path.join(baseDir, filename);

                    const relativePath = '/uploads/simulacoes/${historicoId}/${filename}';

                    fs.writeFileSync(filepath, buffer);

                    await prisma.imagem.create({
                        data: {
                            HistoricoSimulacaoId: historicoId,
                            Endereco: relativePath,
                            Descricao: img.desc,
                            Tipo: img.tipo as "Analoga" | "Analoga2" | "Complementar",
                        },
                    });

                    console.log('Imagem ${img.desc} salva com sucesso');

                } catch (imgError) {
                    console.error('Erro ao processar imagem ${img.desc}:', imgError);
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
            console.error("Erro ao salvar simulação JSON:", error);
            console.error("Stack trace:", error.stack);

            if (error.code === 'P2002') {
                throw new Error("Erro de duplicação no banco de dados");
            } else if (error.code === 'ENOENT') {
                throw new Error("Erro ao criar diretório de upload");
            } else if (error.code === 'EACCES') {
                throw new Error("Erro de permissão ao salvar arquivo");
            } else {
                throw new Error('Erro interno: ${error.message}');
            }
        }
    }
}

export default HistoricoSimulacaoService;