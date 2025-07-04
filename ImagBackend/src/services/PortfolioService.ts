import prisma from "../config/database";
import fs from "fs";
import path from "path";

class PortfolioService {
    static async createPortfolio(
        CabeleireiroID: string,
        SalaoId: string,
        Descricao: string,
    ) {
        try {
            const portfolio = await prisma.portfolio.create({
                data: {
                    CabeleireiroID,
                    SalaoId,
                    Descricao,
                },
            });
            return portfolio;
        } catch (error) {
            console.error("Erro ao criar portfolio:", error);
            throw error;
        }
    }
    static async getPortfolioInfoById(id: string) {
        try {
            const portfolio = await prisma.portfolio.findUnique({
                where: { ID: id },
            });
            return portfolio;
        } catch (error) {
            console.error("Erro ao buscar info de portfolio:", error);
            throw error;
        }
    }
    static async getPortfolioInfoByCabeleireiroId(id: string) {
        try {
            const portfolio = await prisma.portfolio.findUnique({
                where: { CabeleireiroID: id },
            });
            return portfolio;
        } catch (error) {
            console.error("Erro ao buscar info de portfolio por cabeleireiro:", error);
            throw error;
        }
    }
    static async getPortfolioById(id: string) {
        try {
            const portfolio = await prisma.portfolio.findUnique({
                where: { ID: id },
                include: {
                    Cabeleireiro: true,
                    Imagem: true,
                },
            });
            if (!portfolio) {
                console.log("Portfolio não encontrado.");
                return null;
            }
            const fotosComConteudo = (portfolio.Imagem || [])
                .filter((foto: any) => foto.HistoricoSimulacaoId === null)
                .map((foto: { Endereco: string }) => {
                    try {
                        const filePath = path.normalize(
                            path.join(__dirname, "..", "..", foto.Endereco),
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
                                ...foto,
                                fileSize: fileSizeInMB,
                                fileContent: fileContent,
                            };
                        }
                        return {
                            ...foto,
                            fileSize: null,
                            fileContent: null,
                        };
                    } catch (err) {
                        console.error(
                            `Erro ao processar arquivo ${foto.Endereco}:`,
                            err,
                        );
                        return {
                            ...foto,
                            fileSize: null,
                            fileContent: null,
                        };
                    }
                });
            return {
                ID: portfolio.ID,
                Cabeleireiro: portfolio.Cabeleireiro.Nome,
                SalaoId: portfolio.SalaoId,
                Descricao: portfolio.Descricao,
                imagens: fotosComConteudo,
            };
        } catch (error) {
            console.error("Erro ao buscar portfolio por ID:", error);
            throw error;
        }
    }

    static async getAllPortfolios(
        skip: number = 0,
        take: number = 10,
        salaoId: string | null = null,
    ) {
        try {
            const portfolios = await prisma.portfolio.findMany({
                skip: skip,
                take: take,
                where: salaoId ? { SalaoId: salaoId } : undefined,
                include: {
                    Cabeleireiro: true,
                    Imagem: true,
                },
                orderBy: {
                    Descricao: "asc",
                },
            });
            return portfolios;
        } catch (error) {
            console.error("Erro ao buscar todos os portfolios:", error);
            throw error;
        }
    }
    static async deletePortfolio(id: string) {
        try {
            const fotos = await prisma.imagem.findMany({
                where: { PortfolioId: id },
            });
            for (const foto of fotos) {
                try {
                    const filePath = path.normalize(
                        path.join(__dirname, "..", "..", foto.Endereco),
                    );
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log(`Arquivo deletado: ${filePath}`);
                    }
                } catch (err) {
                    console.error(
                        `Erro ao deletar arquivo ${foto.Endereco}:`,
                        err,
                    );
                }
            }
            const portfolio = await prisma.portfolio.delete({
                where: { ID: id },
            });
            console.log("Portfolio deletado:", portfolio);
            return portfolio;
        } catch (error) {
            console.error("Erro ao deletar portfolio:", error);
            throw error;
        }
    }
    static async updatePortfolio(id: string, descricao: string) {
        try {
            const portfolio = await prisma.portfolio.update({
                where: { ID: id },
                data: {
                    Descricao: descricao,
                },
                include: {
                    Cabeleireiro: true,
                    Imagem: true,
                },
            });
            return portfolio;
        } catch (error) {
            console.error("Erro ao atualizar portfolio:", error);
            throw error;
        }
    }
    static async getPortfolioByCabeleireiroId(cabeleireiroId: string) {
        try {
            const portfolio = await prisma.portfolio.findUnique({
                where: {
                    CabeleireiroID: cabeleireiroId,
                },
                include: {
                    Cabeleireiro: true,
                    Imagem: true,
                },
            });
            if (!portfolio) {
                return null;
            }
            const fotosComConteudo = (portfolio.Imagem || [])
                .filter((foto: any) => foto.HistoricoSimulacaoId === null)
                .map((foto: { Endereco: string }) => {
                    try {
                        const filePath = path.normalize(
                            path.join(__dirname, "..", "..", foto.Endereco),
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
                                ...foto,
                                fileSize: fileSizeInMB,
                                fileContent: fileContent,
                            };
                        }
                        return {
                            ...foto,
                            fileSize: null,
                            fileContent: null,
                        };
                    } catch (err) {
                        console.error(
                            `Erro ao processar arquivo ${foto.Endereco}:`,
                            err,
                        );
                        return {
                            ...foto,
                            fileSize: null,
                            fileContent: null,
                        };
                    }
                });
            return {
                ID: portfolio.ID,
                Cabeleireiro: portfolio.Cabeleireiro.Nome,
                SalaoId: portfolio.SalaoId,
                Descricao: portfolio.Descricao,
                imagens: fotosComConteudo,
            };
        } catch (error) {
            console.error("Erro ao buscar portfolio por cabeleireiro:", error);
            throw error;
        }
    }
}
export default PortfolioService;
