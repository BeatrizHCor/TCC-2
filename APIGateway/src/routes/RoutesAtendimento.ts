import { Router, Request, Response } from "express";

import { postAtendimento } from "../services/ServiceAtendimento";
import { userTypes } from "../models/tipo-usuario.enum";
import { authenticate } from "../services/Service";

const RoutesAtendimento = Router();

RoutesAtendimento.post("/atendimento", async (req: Request, res: Response) => {
  const {
    Data,
    PrecoTotal,
    Auxiliar,
    SalaoId,
    servicosAtendimento,
    auxiliares,
    AgendamentoID,
  } = req.body;
  try {
    const userInfo = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString(
        "utf-8"
      ) || "{}"
    );
    let userTypeAuth = userInfo.userType;
    const auth = await authenticate(
      userInfo.userID,
      userInfo.token,
      userInfo.userType
    );
    if (
      !auth ||
      ![
        userTypes.CABELEIREIRO,
        userTypes.FUNCIONARIO,
        userTypes.ADM_SALAO,
        userTypes.ADM_SISTEMA,
      ].includes(userTypeAuth)
    ) {
      res.status(403).json({ message: "Unauthorized" });
    } else {
      const result = await postAtendimento(
        Data,
        PrecoTotal,
        Auxiliar,
        SalaoId,
        servicosAtendimento,
        auxiliares,
        AgendamentoID
      );
      res.status(201).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Erro no ao criar agendamento");
  }
});

export default RoutesAtendimento;
