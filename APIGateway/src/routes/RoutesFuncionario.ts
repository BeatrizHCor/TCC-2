import { Request, Response, Router } from "express";
import {
  deleteFuncionario,
  deleteServico,
  findServicoByNomeAndSalaoId,
  getAuxiliarBySalao,
  getFuncionarioById,
  getFuncionarioPage,
  getServicoById,
  getServicoPage,
  getServicosBySalao,
  postServico,
  updateFuncionario,
  updateServico,
} from "../services/ServiceFunc";
import {
  authenticate,
  cadastrarFuncionario,
  updateLoginPassword,
} from "../services/Service";
import { userTypes } from "../models/tipo-usuario.enum";
import { getUserInfoAndAuth } from "../utils/FazerAutenticacaoEGetUserInfo";
const RoutesFuncionario = Router();

RoutesFuncionario.get(
  "/funcionario/page",
  async (req: Request, res: Response) => {
    const page = (req.query.page as string) || "0";
    const limit = (req.query.limit as string) || "10";
    const nome = (req.query.nome as string) || "";
    const includeRelations = req.query.include === "true";
    const salaoId = (req.query.salaoId as string) || "";
    const mostrarDesativados = req.query.mostrarDesativados === "true";
    try {
      const userInfo = JSON.parse(
        Buffer.from(req.headers.authorization || "", "base64").toString(
          "utf-8",
        ) || "{}",
      );
      if (
        !userInfo ||
        !userInfo.userID ||
        !userInfo.token ||
        !userInfo.userType
      ) {
        console.log("Informações de auntenticação ausentes ou inválidas");
        res.status(403).json({ message: "Unauthorized" });
      } else {
        let userTypeAuth = userInfo.userType;
        const auth = await authenticate(
          userInfo.userID,
          userInfo.token,
          userInfo.userType,
        );
        if (
          !auth ||
          ![
            userTypes.FUNCIONARIO,
            userTypes.ADM_SALAO,
            userTypes.ADM_SISTEMA,
          ].includes(userTypeAuth)
        ) {
          console.log("Chamada não autorizada");
          res.status(403).json({ message: "Unauthorized" });
        } else {
          const funcionarios = await getFuncionarioPage(
            page,
            limit,
            nome,
            includeRelations,
            salaoId,
            mostrarDesativados,
          );
          res.json(funcionarios);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar funcionarios:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },
);

RoutesFuncionario.post(
  "/cadastrar/funcionario",
  async (req: Request, res: Response) => {
    let {
      CPF,
      Nome,
      Email,
      Telefone,
      SalaoId,
      Auxiliar,
      Salario,
      Password,
      userType,
    } = req.body;
    try {
      const userInfo = JSON.parse(
        Buffer.from(req.headers.authorization || "", "base64").toString(
          "utf-8",
        ) || "{}",
      );
      let userTypeAuth = userInfo.userType;
      const auth = await authenticate(
        userInfo.userID,
        userInfo.token,
        userInfo.userType,
      );
      if (
        !auth ||
        ![
          userTypes.FUNCIONARIO,
          userTypes.ADM_SALAO,
          userTypes.ADM_SISTEMA,
        ].includes(userTypeAuth)
      ) {
        console.log("Chamada não autorizada");
        res.status(403).json({ message: "Unauthorized" });
      } else {
        if (
          !CPF ||
          !Nome ||
          !Email ||
          !Telefone ||
          !SalaoId ||
          !Password ||
          !Salario ||
          !userType
        ) {
          res.status(400).json({
            message:
              "Erro ao cadastrar funcionario, parametros ausentes ou invalidos",
          });
        } else {
          const result = await cadastrarFuncionario(
            CPF,
            Nome,
            Email,
            Telefone,
            SalaoId,
            Auxiliar,
            Salario,
            Password,
            userType,
          );
          if (result) {
            res.status(201).json(result);
          } else {
            res.status(500).json({ message: "Erro ao cadastrar funcionario" });
          }
        }
      }
    } catch (e) {
      console.log("Erro ao realizar operação: ", e);
      res.status(500).send("Error in creating Funcionario");
    }
  },
);

RoutesFuncionario.delete(
  "/funcionario/delete/:id",
  async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const userInfo = JSON.parse(
        Buffer.from(req.headers.authorization || "", "base64").toString(
          "utf-8",
        ) || "{}",
      );
      let userTypeAuth = userInfo.userType;
      const auth = await authenticate(
        userInfo.userID,
        userInfo.token,
        userInfo.userType,
      );
      if (
        !auth ||
        ![
          userTypes.FUNCIONARIO,
          userTypes.ADM_SALAO,
          userTypes.ADM_SISTEMA,
        ].includes(userTypeAuth)
      ) {
        res.status(403).json({ message: "Unauthorized" });
      } else {
        let funcionarioDelete = await deleteFuncionario(id);
        if (funcionarioDelete && funcionarioDelete.status === "excluido") {
          res.status(200).json({
            message: funcionarioDelete.message,
            status: "excluido",
          });
        } else if (
          funcionarioDelete && funcionarioDelete.status === "desativado"
        ) {
          res.status(200).json({
            message: funcionarioDelete.message,
            status: "desativado",
          });
        } else {
          res.status(404).json({ message: "Funcionario not deleted" });
        }
      }
    } catch (e) {
      console.log("Erro ao realizar operação: ", e);
      res.status(500).send("Error in deleting Funcionario");
    }
  },
);

RoutesFuncionario.get(
  "/funcionario/ID/:id",
  async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      let funcionario = await getFuncionarioById(id);
      if (funcionario) {
        res.status(200).send(funcionario);
      } else {
        res.status(404).send("Funcionario not found");
      }
    } catch (e) {
      console.log("", e);
      res.status(500).send("Error in getting Funcionario");
    }
  },
);

RoutesFuncionario.get(
  "/auxiliar/:salaoId",
  async (req: Request, res: Response) => {
    const { salaoId } = req.params;
    try {
      let funcionario = await getAuxiliarBySalao(salaoId);
      if (funcionario) {
        res.status(200).send(funcionario);
      } else {
        res.status(204).send("Auxiliar not found");
      }
    } catch (e) {
      console.log("", e);
      res.status(500).send("Error in getting Funcionario");
    }
  },
);

RoutesFuncionario.put(
  "/funcionario/update/:id",
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { Nome, CPF, Email, Telefone, SalaoId, Auxiliar, Salario, password } =
      req.body;
    try {
      if (
        !Nome ||
        !CPF ||
        !Email ||
        !Telefone ||
        !SalaoId ||
        !Salario
      ) {
        res.status(400).send("Missing required fields");
        return;
      }
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (
        !auth ||
        ![
          userTypes.FUNCIONARIO,
          userTypes.ADM_SALAO,
          userTypes.ADM_SISTEMA,
        ].includes(userInfo?.userType)
      ) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
      let funcionarioback = await getFuncionarioById(id);
      if (!funcionarioback) {
        res.status(404).send("Funcionario not found");
        return;
      }
      let funcionarioUpdate = await updateFuncionario(
        id,
        Nome,
        CPF,
        Email,
        Telefone,
        SalaoId,
        Auxiliar,
        Salario,
      );
      if (!funcionarioUpdate) {
        res.status(404).send("Funcionario not found");
        return;
      }
      if (password || Email) {
        const result = await updateLoginPassword(
          funcionarioUpdate.ID!,
          password,
          funcionarioUpdate.SalaoId,
          Email,
        );
        if (result.success) {
          res.status(200).send(funcionarioUpdate);
          return;
        } else {
          let updateCorrecao = await updateFuncionario(
            id,
            funcionarioback.Nome,
            funcionarioback.CPF,
            funcionarioback.Email,
            funcionarioback.Telefone,
            funcionarioback.SalaoId,
            funcionarioback.Auxiliar,
            funcionarioback.Salario ? funcionarioback.Salario : 0,
          );
          if (!updateCorrecao) {
            res.status(404).json({
              message: "Erro ao atualizar funcionario, correções falharam",
            });
            return;
          }
          res.status(200).json({
            message:
              "A atualização do login falhou, mas o funcionário foi restaurado ao estado anterior. Nenhuma alteração permanente foi feita.",
            status: "compensado",
          });
        }
      }
    } catch (e) {
      console.log("Erro ao realizar operação: ", e);
      res.status(500).send("Error in updating Funcionario");
    }
  },
);

//--------SERVIÇO--------//

RoutesFuncionario.get("/servico/page", async (req: Request, res: Response) => {
  const page = (req.query.page as string) || "0";
  const limit = (req.query.limit as string) || "10";
  const nome = (req.query.nome as string) || "";
  const precoMin = (req.query.precoMin as string) || "";
  const precoMax = (req.query.precoMax as string) || "";
  const includeRelations = req.query.include === "true" ? true : false;
  const salaoId = (req.query.salaoId as string) || "";
  try {
    const funcionarios = await getServicoPage(
      page,
      limit,
      salaoId,
      nome,
      precoMin,
      precoMax,
      includeRelations,
    );
    res.json(funcionarios);
  } catch (error) {
    console.error("Erro ao buscar Serviços:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

RoutesFuncionario.post("/servico", async (req: Request, res: Response) => {
  let { Nome, SalaoId, PrecoMin, PrecoMax, Descricao } = req.body;
  try {
    const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
    if (
      !auth ||
      ![
        userTypes.FUNCIONARIO,
        userTypes.ADM_SALAO,
        userTypes.ADM_SISTEMA,
      ].includes(userInfo?.userType)
    ) {
      res.status(403).json({ message: "Unauthorized" });
    } else {
      let servico = await postServico(
        Nome,
        SalaoId,
        PrecoMin,
        PrecoMax,
        Descricao,
      );
      res.status(201).send(servico);
    }
  } catch (e) {
    console.log("Erro ao realizar operação: ", e);
    res.status(500).send("Error in creating service");
  }
});
RoutesFuncionario.delete(
  "/servico/delete/:id",
  async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (
        !auth ||
        ![
          userTypes.FUNCIONARIO,
          userTypes.ADM_SALAO,
          userTypes.ADM_SISTEMA,
        ].includes(userInfo?.userType)
      ) {
        res.status(403).json({ message: "Unauthorized" });
      } else {
        let servicoDelete = await deleteServico(id);
        if (servicoDelete) {
          res.status(204).send();
        } else {
          res.status(404).send("Servico not found");
        }
      }
    } catch (e) {
      console.log("Erro ao realizar operação: ", e);
      res.status(500).send("Error in deleting Funcionario");
    }
  },
);

RoutesFuncionario.put(
  "/servico/update/:id",
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { Nome, SalaoId, PrecoMin, PrecoMax, Descricao } = req.body;

    try {
      const { userInfo, auth } = await getUserInfoAndAuth(req.headers);
      if (
        !auth ||
        ![
          userTypes.FUNCIONARIO,
          userTypes.ADM_SALAO,
          userTypes.ADM_SISTEMA,
        ].includes(userInfo?.userType)
      ) {
        res.status(403).json({ message: "Unauthorized" });
      } else {
        let servicoUpdate = await updateServico(
          id,
          Nome,
          SalaoId,
          PrecoMin,
          PrecoMax,
          Descricao,
        );
        if (servicoUpdate) {
          res.status(200).send(servicoUpdate);
        }
      }
    } catch (e) {
      console.log("Erro ao realizar operação: ", e);
      res.status(500).send("Error in updating Funcionario");
    }
  },
);

RoutesFuncionario.get(
  "/servico/ID/:id",
  async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      let servico = await getServicoById(id);
      if (servico) {
        res.status(200).send(servico);
      } else {
        res.status(404).send("Servico not found");
      }
    } catch (e) {
      console.log("Erro ao realizar operação: ", e);
      res.status(500).send("Error in getting Funcionario");
    }
  },
);

RoutesFuncionario.get(
  "/servico/salao/:salaoId",
  async (req: Request, res: Response) => {
    const { salaoId } = req.params;
    try {
      let servico = await getServicosBySalao(salaoId);
      if (servico) {
        res.status(200).send(servico);
      } else {
        res.status(404).send("Servico not found");
      }
    } catch (e) {
      console.log("Erro ao realizar operação: ", e);
      res.status(500).send("Error in getting Funcionario");
    }
  },
);

RoutesFuncionario.get(
  "/servico/find/:nome/:salaoId",
  async (req: Request, res: Response) => {
    const { nome, salaoId } = req.params;
    try {
      let servico = await findServicoByNomeAndSalaoId(nome, salaoId);
      if (servico) {
        res.status(200).send(servico);
      } else {
        res.status(404).send("Servico not found");
      }
    } catch (e) {
      console.log("Erro ao realizar operação: ", e);
      res.status(500).send("Error in finding Servicos");
    }
  },
);
export default RoutesFuncionario;
