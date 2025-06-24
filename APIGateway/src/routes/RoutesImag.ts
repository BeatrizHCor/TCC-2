import { Request, Response, Router } from "express";
import {
    deleteImagemByIdNoPortfolio,
    getImagemById,
    getPortfolioByCabeleireiroId,
    getPortfolioImages,
    getPortfolioInfoById,
    updatePortfolioDescricaoById,
} from "../services/ServiceImag";
import { handleApiResponse } from "../utils/HandlerDeRespostaDoBackend";

import { userTypes } from "../models/tipo-usuario.enum";
import { getUserInfoAndAuth } from "../utils/FazerAutenticacaoEGetUserInfo";
import multer from "multer";

import "dotenv/config";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const RoutesImagem = Router();
RoutesImagem.get(
    "/portfolio/:cabeleireiroId",
    async (req: Request, res: Response) => {
        let { cabeleireiroId } = req.params;
        try {
            let portfolio = await getPortfolioByCabeleireiroId(cabeleireiroId);
            if (portfolio) {
                res.status(200).send(portfolio);
            } else {
                res.status(204).send();
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error em busacar portfolio" });
        }
    },
);

RoutesImagem.get(
    "/portfolio/ID/:id",
    async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const portfolio = await getPortfolioImages(id);
            if (portfolio) {
                res.status(200).send(portfolio);
            } else {
                res.status(204).send();
            }
        } catch (e) {
            console.error(e);
            res.status(500).send("Erro ao buscar imagens do portfolio");
        }
    },
);
RoutesImagem.put(
    "/portfolio/:PortfolioId",
    async (req: Request, res: Response) => {
        try {
            const { PortfolioId } = req.params;
            const { descricaoPortfolio } = req.body;
            const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
            let portfolio = await getPortfolioInfoById(PortfolioId);
            if (!portfolio) {
                res.status(409).json({
                    message:
                        "Dados invalidos ou ausentes ao atualizar descriacao, Portfolio nao localizado",
                });
                return;
            }
            if (
                userInfo.userType === userTypes.CABELEIREIRO &&
                userInfo.userID !== portfolio.CabeleireiroID
            ) {
                res.status(403).json({ message: "Não autorizado" });
                return;
            } else {
                if (
                    !auth &&
                    ![
                        userTypes.CABELEIREIRO,
                        userTypes.ADM_SALAO,
                        userTypes.ADM_SISTEMA,
                    ].includes(userInfo.userType)
                ) {
                    res.status(403).json({ message: "Unauthorized" });
                } else {
                    const result = await updatePortfolioDescricaoById(
                        PortfolioId,
                        descricaoPortfolio,
                    );

                    if (result) {
                        res.status(200).json(result);
                    } else {
                        res.status(500).json({
                            message: "erro ao atualizar descriçao do portfolio",
                        });
                    }
                }
            }
        } catch (e) {
            console.error(e);
            res.status(500).send("Erro ao atualizar descriçao do portfolio");
        }
    },
);
RoutesImagem.get(
    "/imagem/ID/:id",
    async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const imagem = await getImagemById(id);
            if (imagem) {
                res.status(200).send(imagem);
            } else {
                res.status(204).send();
            }
        } catch (e) {
            console.error(e);
            res.status(500).send("Erro ao buscar imagem");
        }
    },
);
RoutesImagem.get(
    "/portfolio/info/:id",
    async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const imagem = await getPortfolioInfoById(id);
            if (imagem) {
                res.status(200).send(imagem);
            } else {
                res.status(204).send();
            }
        } catch (e) {
            console.error(e);
            res.status(500).send("Erro ao buscar imagem");
        }
    },
);
RoutesImagem.post(
    "/imagem/portfolio/:PortfolioId",
    upload.single("imagem"),
    async (req: Request, res: Response) => {
        try {
            const { PortfolioId } = req.params;
            const { userInfo, auth } = await getUserInfoAndAuth(req.headers);

            const portfolio = await getPortfolioInfoById(PortfolioId);
            if (!portfolio) {
                res.status(409).json({
                    message:
                        "Dados inválidos ou ausentes. Portfolio não encontrado.",
                });
                return;
            }

            if (
                userInfo.userType === userTypes.CABELEIREIRO &&
                userInfo.userID !== portfolio.CabeleireiroID
            ) {
                res.status(403).json({ message: "Não autorizado" });
                return;
            }
            if (
                !auth &&
                ![
                    userTypes.CABELEIREIRO,
                    userTypes.ADM_SALAO,
                    userTypes.ADM_SISTEMA,
                ].includes(userInfo.userType)
            ) {
                res.status(403).json({ message: "Unauthorized" });
                return;
            }
            if (!req.file) {
                res.status(400).json({ message: "Nenhum arquivo foi enviado" });
                return;
            }

            const FormData = require("form-data");
            const form = new FormData();

            form.append("imagem", req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
            });

            const portfolioIdToSend = req.body.PortfolioId || PortfolioId;
            form.append("PortfolioId", portfolioIdToSend);
            form.append("Descricao", req.body.Descricao || "");

            console.log("Dados sendo enviados:", {
                PortfolioId: portfolioIdToSend,
                Descricao: req.body.Descricao || "",
                arquivo: req.file.originalname,
                tamanho: req.file.size,
            });

            const axios = require("axios");

            const response = await axios.post(
                `${process.env.VITE_IMAGEM_URL}/imagem/portfolio`,
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                        Authorization: req.headers.authorization || "",
                    },
                },
            );

            const result = response.data;

            if (response.status === 200 || response.status === 201) {
                res.status(200).json(result);
            } else {
                console.error("Erro do backend de imagens:", result);
                res.status(response.status).json({
                    message: "Erro ao enviar imagem para backend de imagens",
                    detalhes: result,
                });
            }
        } catch (e: any) {
            console.error("Erro no gateway:", e);

         
            if (e.response) {
                res.status(e.response.status).json({
                    message: "Erro ao enviar para backend de imagens",
                    error: e.response.data,
                });
            } else {
                res.status(500).json({
                    message: "Erro interno ao processar imagem",
                    error: e.message,
                });
            }
        }
    },
);

RoutesImagem.delete(
    "/imagem/:portfolioId/:imagemId",
    async (req: Request, res: Response) => {
        try {
            const { portfolioId, imagemId } = req.params;
            const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
            let portfolio = await getPortfolioInfoById(portfolioId);
            if (!portfolioId || !imagemId || !portfolio) {
                res.status(409).json({
                    message:
                        "Dados invalidos ou ausentes ao excluir imagem de portfolio",
                });
                return;
            }
            if (
                userInfo.userType === userTypes.CABELEIREIRO &&
                userInfo.userID !== portfolio.CabeleireiroID
            ) {
                res.status(403).json({ message: "Não autorizado" });
                return;
            } else {
                if (
                    !auth &&
                    ![
                        userTypes.CABELEIREIRO,
                        userTypes.ADM_SALAO,
                        userTypes.ADM_SISTEMA,
                    ].includes(userInfo.userType)
                ) {
                    res.status(403).json({ message: "Unauthorized" });
                } else {
                    const result = await deleteImagemByIdNoPortfolio(
                        portfolioId,
                        imagemId,
                    );

                    if (result) {
                        res.status(204).send();
                    } else {
                        res.status(500).json({
                            message: "erro ao excluir foto do portfolio",
                        });
                    }
                }
            }
        } catch (e) {
            console.error(e);
            res.status(500).send("Erro ao buscar imagem");
        }
    },
);
export default RoutesImagem;