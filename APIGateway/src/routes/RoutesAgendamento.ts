import { Router, Request, Response } from "express";
import { 
  CabeleireirogetAgendamentoById,
  ClientegetAgendamentoById,
  FuncionariogetAgendamentoById, 
  getAgendamentosPage, 
  postAgendamento, 
  updateAgendamento } from "../services/ServiceAgendamento";


const RoutesAgendamento = Router();

RoutesAgendamento.post(
  "/agendamento",
    async(req: Request, res: Response) => {
      const { Data, ClienteID, SalaoId, CabeleireiroID } = req.body;
      const { ServicoId } = req.body;
      try{
        const result = await postAgendamento(Data, ClienteID,  CabeleireiroID, SalaoId, ServicoId);
        res.status(201).json(result);
      } catch(e){
        console.log(e);
        res.status(500).send("Erro no ao criar agendamento");
      }
    }
)

RoutesAgendamento.get(
    "/agendamento/page",
    async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const includeRelations = req.query.include === "true";
        const salaoId = parseInt(req.query.salaoId as string) || 0;
        const dia = parseInt(req.query.dia as string) || 0;
        const mes = parseInt(req.query.mes as string) || 0;
        const ano = parseInt(req.query.ano as string) || 0;

        try {
            const agendamentos = await getAgendamentosPage(
                page,
                limit,
                includeRelations,
                salaoId,
                dia,
                mes,
                ano
            );
            res.json(agendamentos);
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
            res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
);

RoutesAgendamento.get(
  "/funcionario/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const includeRelations = req.query.includeRelations === "true";
    try {
      const agendamento = await FuncionariogetAgendamentoById(id, includeRelations);
      res.json(agendamento);
    } catch (error) {
      console.error("Erro ao buscar agendamento por ID:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);

RoutesAgendamento.get(
  "/cabeleireiro/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const includeRelations = req.query.includeRelations === "true";
    try {
      const agendamento = await CabeleireirogetAgendamentoById(id, includeRelations);
      res.json(agendamento);
    } catch (error) {
      console.error("Erro ao buscar agendamento por ID:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);

RoutesAgendamento.get(
  "/cliente/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const includeRelations = req.query.includeRelations === "true";
    try {
      const agendamento = await ClientegetAgendamentoById(id, includeRelations);
      res.json(agendamento);
    } catch (error) {
      console.error("Erro ao buscar agendamento por ID:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);
RoutesAgendamento.put(
  "/agendamento/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Data, Status, ClienteID, CabeleireiroID, SalaoId, servicosIds } = req.body;
    try {
      const agendamento = await updateAgendamento(
        id,
        Data,
        Status,
        ClienteID,
        CabeleireiroID,
        SalaoId,
        servicosIds
      );
      res.json(agendamento);
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
);


export default RoutesAgendamento;