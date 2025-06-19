import { Request, Response, Router } from "express";
import {
    getImagemById,
    getPortfolioByCabeleireriroId,
    getPortfolioImages
} from "../services/ServiceImag";
import { handleApiResponse } from "../utils/HandlerDeRespostaDoBackend";
import { Imagem } from "../models/imagemModel";
import { userTypes } from "../models/tipo-usuario.enum";
import { getUserInfoAndAuth } from "../utils/FazerAutenticacaoEGetUserInfo";

const RoutesImagem = Router();

RoutesImagem.get(
    "/portfolio/:cabeleireiroId",
    async (req: Request, res: Response) => {
        let { cabeleireiroId } = req.params;
        try {
            let portfolio = await getPortfolioByCabeleireriroId(cabeleireiroId);
            if (portfolio) {
                res.status(200).send(portfolio);
            } else {
                res.status(204).send({
                    message:
                        "Nenhum portfolio localizado para esse cabeleirerio",
                });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Error in creating portfolio");
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
                res.status(204).send({
                    message: "Nenhum portfolio localizado para esse ID",
                });
            }
        } catch (e) {
            console.error(e);
            res.status(500).send("Erro ao buscar imagens do portfolio");
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
                res.status(204).send({
                    message: "Nenhuma imagem localizada para esse ID",
                });
            }
        } catch (e) {
            console.error(e);
            res.status(500).send("Erro ao buscar imagem");
        }
    },
);

RoutesImagem.post(
    "/imagem/portfolio",
    async (req: Request, res: Response) => {
        try {
            const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
            if (!userInfo) {
                res.status(403).json({ message: "Não autorizado" });
                return;
            } else {
                if (
                    !auth &&
                    ![
                        userTypes.CABELEIREIRO,
                        userTypes.ADM_SALAO,
                        userTypes.ADM_SISTEMA,
                    ].includes(userInfo.userType) &&
                    !userInfo.userID === req.body.Cabeleireiro
                ) {
                    res.status(403).json({ message: "Unauthorized" });
                } else {
                    const imagem = await fetch(
                        `${process.env.VITE_IMAGEM_URL}/imagem/portfolio`,
                        {
                            method: "POST",
                            headers: req.headers as any,
                            body: req as any,
                        },
                    );

                    const result = await handleApiResponse<Imagem>(
                        imagem,
                        "upload imagem para Portfolio",
                    );

                    if (result) {
                        res.status(200).json(imagem);
                    } else {
                        res.status(500).json({
                            message: "erro ao adicionar foto ao portfolio",
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
