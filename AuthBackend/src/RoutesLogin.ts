import { Request, Response, Router } from "express";
import {
  deleteAuth,
  registerLogin,
  verifyPasswordAndReturnToken,
  verifyTokenAndType,
} from "./Controller";
import {
  deleteCliente,
  getClienteByCPF,
  postCliente,
} from "./Services/ServiceClient";
import {
  deleteFuncionario,
  getFuncionarioByCpf,
  getFuncionarioById,
  postFuncionario,
  updateFuncionario,
} from "./Services/ServiceFunc";
import {
  deleteCabeleireiro,
  getCabeleireiroById,
  postCabeleireiro,
  updateCabeleireiro,
} from "./Services/ServiceCabelereiro";
import {
  createPortfolio,
  deletePortfolio,
  getPortfolioByCabeleireiroId,
} from "./Services/ServiceImag";
import { StatusCadastro } from "@prisma/client";
import { findLoginbyUserId } from "./Services/Service";
import { updateLoginPassword } from "./Controller"; // certifique-se de importar corretamente

const RoutesLogin = Router();

RoutesLogin.get("/login", (req: Request, res: Response) => {
  res.send("This is a login, please use post");
});

RoutesLogin.post("/register", (req: Request, res: Response) => {
  let { userID, Email, Password, SalaoId, userType } = req.body;
  if (typeof Password !== "string" || Password.trim() === "") {
    res.status(400).json({ message: "Password inválido" });
    return;
  }
  registerLogin(userID, Email, Password, SalaoId, userType)
    .then((r) => {
      if (r) {
        res.status(201).json({ status: 201, message: "login created" });
      } else {
        res
          .status(403)
          .json({ status: 403, message: "problema ao criar login" });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ message: "erro" });
    });
});

RoutesLogin.post("/login", async (req: Request, res: Response) => {
  let { Email, password, SalaoID } = req.body;
  console.log(req.body);
  console.log(req.body);
  let token = await verifyPasswordAndReturnToken(Email, password, SalaoID);
  if (token) {
    res.status(200).send(token);
  } else {
    res.status(401).send();
  }
});

RoutesLogin.post("/authenticate", async (req: Request, res: Response) => {
  let { userID, token, userType } = req.body;
  let newToken = await verifyTokenAndType(token, userID, userType);
  if (newToken) {
    res.status(200).send(newToken);
  } else {
    res.status(403).send();
  }
});

RoutesLogin.delete("/login", (req: Request, res: Response) => {
  let { userID } = req.body;
  deleteAuth(userID)
    .then((r) => {
      if (r) {
        res.status(200).json({ message: "login deleted" });
      } else {
        res.status(403).json({ message: "problema ao deletar login" });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ message: "erro" });
    });
});

RoutesLogin.post("/cadastrar/cliente", async (req: Request, res: Response) => {
  let { CPF, Nome, Email, Telefone, SalaoId, Password, userType } = req.body;
  try {
    let ChecarCPF = await getClienteByCPF(CPF, SalaoId);
    console.log("Resposta de checagem de cpf:", ChecarCPF);
    if (ChecarCPF) {
      res.status(409).json({ message: "CPF já cadastrado no salão" });
      return;
    }
    let cliente = await postCliente(CPF, Nome, Email, Telefone, SalaoId);
    if (!cliente) {
      throw new Error("Cliente not created");
    }
    console.log("Cliente ID: ", cliente.ID);
    let register = await registerLogin(
      cliente.ID!,
      Email,
      Password,
      SalaoId,
      userType,
    );
    if (!register) {
      console.log("Register auth failed");
      let clienteDelete = await deleteCliente(cliente.ID!);
      if (clienteDelete) {
        console.log("Cliente deleted successfully");
      } else {
        console.log("Failed to delete cliente after register failure");
      }
      throw new Error("Login registration failed");
    }
    let token = await verifyPasswordAndReturnToken(Email, Password, SalaoId);
    res.status(200).send(token);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error in creating customer");
  }
});

RoutesLogin.post(
  "/cadastrar/cabeleireiro",
  async (req: Request, res: Response) => {
    let { CPF, Nome, Email, Telefone, SalaoId, Password, userType, Mei } =
      req.body;
    console.log(req.body);
    try {
      let cabeleireiro = await postCabeleireiro(
        CPF,
        Nome,
        Email,
        Telefone,
        SalaoId,
        Mei,
        undefined,
      );
      if (!cabeleireiro) {
        throw new Error("Cabeleireiro not created");
      }
      console.log("Cabeleireiro created: ", cabeleireiro);
      let portfolio = await createPortfolio(
        cabeleireiro.ID!,
        "Portfolio de " + Nome,
        SalaoId,
      );
      if (!portfolio) {
        console.log("Portfolio not created");
        let cabeleireiroDelete = await deleteCabeleireiro(cabeleireiro.ID!);
        if (cabeleireiroDelete) {
          console.log("Cabeleireiro deleted successfully");
        } else {
          console.log(
            "Falha ao deletar cabeleireiro após falha na criação do portfolio",
          );
        }
        throw new Error("Portfolio creation failed");
      } else {
        console.log("Portfolio created: ", portfolio);
        let register = await registerLogin(
          cabeleireiro.ID!,
          Email,
          String(Password),
          SalaoId,
          userType,
        );
        if (!register) {
          console.log("Register failed");
          let cabeleireiroDelete = await deleteCabeleireiro(cabeleireiro.ID!);
          let portfolioDelete = await deletePortfolio(portfolio.ID!);
          if (cabeleireiroDelete && portfolioDelete) {
            console.log("Cabeleireiro e Portfolio deletados com sucesso.");
          } else if (!cabeleireiroDelete) {
            console.log("Falha ao deletar cabeleireiro após falha no registro");
          } else if (!portfolioDelete) {
            console.log("Falha ao deletar portfolio após falha no registro");
          }
          throw new Error("Login registration failed");
        }
        console.log("Cabeleireiro login: ", register);
        let token = await verifyPasswordAndReturnToken(
          Email,
          Password,
          SalaoId,
        );
        res.status(200).send(token);
      }
    } catch (e) {
      console.log(e);
      res.status(500).send("Error in creating Cabeleireiro");
    }
  },
);

RoutesLogin.post(
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
      let ChecarCPF = await getFuncionarioByCpf(CPF, SalaoId);
      console.log("Resposta de checagem de cpf:", ChecarCPF);
      if (ChecarCPF) {
        res.status(409).json({ message: "CPF já cadastrado no salão" });
        return;
      }
      let funcionario = await postFuncionario(
        CPF,
        Nome,
        Email,
        Telefone,
        SalaoId,
        Auxiliar,
        Salario,
      );
      if (!funcionario) {
        throw new Error("Funcionario not created");
      }
      let register = await registerLogin(
        funcionario.ID!,
        Email,
        Password,
        SalaoId,
        userType,
      );
      if (!register) {
        console.log("Register auth failed, deleting user");
        let funcionarioDelete = await deleteFuncionario(funcionario.ID!);
        if (funcionarioDelete) {
          console.log("Funcionario deleted successfully");
        } else {
          console.log("Failed to delete funcionario after register failure");
        }
        throw new Error("Login registration failed");
      }
      let token = await verifyPasswordAndReturnToken(Email, Password, SalaoId);

      res.status(200).send(token);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error in creating Funcionario");
    }
  },
);

RoutesLogin.delete(
  "/funcionario/delete/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      try {
        let deleted = await deleteFuncionario(id);
        console.log("Deletando funcionario: ", id);
        if (deleted) {
          await deleteAuth(id);
          res.status(200).json({
            message: "Funcionário deletado com sucesso.",
          });
          return;
        }
      } catch (err: any) {
        if (err.message && err.message.includes("em uso")) {
          console.log("Funcionário em uso, desativando...");
          const funcionarioAtual = await getFuncionarioById(id);
          if (funcionarioAtual) {
            let ok =await updateFuncionario(
              id,
              funcionarioAtual.Nome,
              funcionarioAtual.CPF,
              funcionarioAtual.Email,
              funcionarioAtual.Telefone,
              funcionarioAtual.SalaoId,
              funcionarioAtual.Auxiliar,
              funcionarioAtual.Salario || 0,
              StatusCadastro.DESATIVADO,
            );
            ok ? console.log("Funcionário desativado com sucesso.") : console.log("Falha ao desativar funcionário.");
          }
          await deleteAuth(id);
          res.status(200).json({
            message:
              "Funcionário não pôde ser removido por dependências, mas foi desativado e a autorização removida.",
          });
          return;
        } else {
          throw err;
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Erro ao deletar/desativar funcionário.",
      });
    }
  },
);
RoutesLogin.delete(
  "/cabeleireiro/delete/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;

    let cabeleireiroBackup = null;
    let loginBackup = null;
    let portfolioBackup = null;

    try {
      cabeleireiroBackup = await getCabeleireiroById(id, false);
      loginBackup = await findLoginbyUserId(id);
      portfolioBackup = await getPortfolioByCabeleireiroId(id);

      if (!cabeleireiroBackup) {
        res.status(404).json({ message: "Cabeleireiro não encontrado." });
        return;
      }
    } catch (error) {
      console.error("Erro ao buscar dados para backup:", error);
      res.status(500).json({
        message: "Erro ao acessar dados do cabeleireiro ou portfolio.",
      });
      return;
    }
    let cabeleireiroDeleted = false;
    let cabeleireiroDeactivated = false;
    let loginDeleted = false;
    let portfolioDeleted = false;

    try {
      if (portfolioBackup && portfolioBackup.ID) {
        const portfolioDeleteResult = await deletePortfolio(portfolioBackup.ID);
        if (!portfolioDeleteResult) {
          console.log("Falha ao deletar portfolio do cabeleireiro");
        }
        portfolioDeleted = true;
      }
      try {
        await deleteCabeleireiro(id);
        cabeleireiroDeleted = true;
      } catch (err: any) {
        if (err.message && err.message.includes("em uso")) {
          await updateCabeleireiro(
            cabeleireiroBackup.Email,
            cabeleireiroBackup.CPF,
            cabeleireiroBackup.Telefone,
            cabeleireiroBackup.SalaoId,
            cabeleireiroBackup.Mei ?? undefined,
            cabeleireiroBackup.Nome,
            cabeleireiroBackup.ID,
            StatusCadastro.DESATIVADO,
          );
          cabeleireiroDeactivated = true;
        } else {
          throw new Error("Falha ao deletar cabeleireiro");
        }
      }
      const loginDeleteResult = await deleteAuth(id);
      if (!loginDeleteResult) {
        throw new Error("Falha ao deletar login do cabeleireiro");
      }
      loginDeleted = true;

      res.status(200).json({
        message: cabeleireiroDeleted
          ? "Cabeleireiro deletado, portfolio e login removidos com sucesso."
          : "Cabeleireiro desativado, portfolio e login removidos com sucesso.",
        details: {
          cabeleireiroDeleted,
          cabeleireiroDeactivated,
          loginDeleted: true,
          portfolioDeleted: !!portfolioBackup,
        },
      });
    } catch (error) {
      console.error("Erro durante operação de deleção:", error);
      await performRollbackCabeleireiro(
        cabeleireiroBackup,
        loginBackup,
        portfolioBackup,
        cabeleireiroDeleted,
        cabeleireiroDeactivated,
        loginDeleted,
        portfolioDeleted,
      );
      res.status(500).json({
        message:
          "Erro durante a operação. Todas as alterações foram revertidas.",
        error: (error as Error).message,
      });
    }
  },
);

async function performRollbackCabeleireiro(
  cabeleireiroBackup: any,
  loginBackup: any,
  portfolioBackup: any,
  cabeleireiroDeleted: boolean,
  cabeleireiroDeactivated: boolean,
  loginDeleted: boolean,
  portfolioDeleted: boolean,
) {
  try {
    console.log("Iniciando rollback...");
    if (portfolioDeleted && portfolioBackup) {
      try {
        await createPortfolio(
          portfolioBackup.CabeleireiroId,
          portfolioBackup.Descricao,
          portfolioBackup.SalaoId,
        );
        console.log("Portfolio restaurado com sucesso");
      } catch (error) {
        console.error("Erro ao restaurar portfolio:", error);
      }
    }
    if (cabeleireiroDeleted && cabeleireiroBackup) {
      try {
        await postCabeleireiro(
          cabeleireiroBackup.CPF,
          cabeleireiroBackup.Nome,
          cabeleireiroBackup.Email,
          cabeleireiroBackup.Telefone,
          cabeleireiroBackup.SalaoId,
          cabeleireiroBackup.Mei ?? "",
          cabeleireiroBackup.ID ?? undefined,
        );
        console.log("Cabeleireiro recriado com sucesso");
      } catch (error) {
        console.error("Erro ao recriar cabeleireiro:", error);
      }
    } else if (cabeleireiroDeactivated && cabeleireiroBackup) {
      try {
        await updateCabeleireiro(
          cabeleireiroBackup.Email,
          cabeleireiroBackup.CPF,
          cabeleireiroBackup.Telefone,
          cabeleireiroBackup.SalaoId,
          cabeleireiroBackup.Mei ?? undefined,
          cabeleireiroBackup.Nome,
          cabeleireiroBackup.ID,
          StatusCadastro.ATIVO,
        );
        console.log("Cabeleireiro reativado com sucesso");
      } catch (error) {
        console.error("Erro ao reativar cabeleireiro:", error);
      }
    }
    console.log("Rollback concluído");
  } catch (error) {
    console.error("Erro crítico durante rollback:", error);
  }
}

RoutesLogin.put("/login/update", async (req: Request, res: Response) => {
  const { userID, newPassword, SalaoId } = req.body;
  if (!userID || !newPassword || !SalaoId) {
    res.status(400).json({ message: "Parâmetros obrigatórios ausentes." });
    return;
  }
  try {
    const updated = await updateLoginPassword(userID, newPassword, SalaoId);
    if (updated) {
      res.status(200).json({ message: "Senha do login atualizada com sucesso." });
    } else {
      res.status(400).json({ message: "Falha ao atualizar senha do login." });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Erro ao atualizar senha do login." });
  }
});

export default RoutesLogin;
