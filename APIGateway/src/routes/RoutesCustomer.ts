import { Router, Request, Response } from "express";
import { 
  postCliente, 
  getClientePage, 
  getClienteByCPF, 
  deleteCliente, 
  updateCliente} from "../services/ServiceClient";
import {  
  postLogin, 
  registerLogin, } from "../services/Service";

const RoutesCustomer = Router();


RoutesCustomer.post(
  "/cliente", 
  async (req: Request, res: Response) => {
  let { CPF, Nome, Email, Telefone, SalaoId, Password, userType } = req.body;
  try {
    let cliente = await postCliente(CPF, Nome, Email, Telefone, SalaoId);
    if (!cliente) {
      console.log("Cliente not created");
      throw new Error("Cliente not created");
    }
    console.log("Cliente ID: ", cliente.ID);
    let register = await registerLogin(
      cliente.ID!,
      Email,
      Password,
      SalaoId,
      userType
    );
    if (register !== 201) {
      console.log("Register auth failed");
      let clienteDelete = await deleteCliente(cliente.ID!);
      if (clienteDelete) {
        console.log("Cliente deleted successfully");
      }else{
        console.log("Failed to delete cliente after register failure");
      }
      throw new Error("Login registration failed");
    }
    let token = await postLogin(Email, Password, SalaoId);
    res.status(200).send(token);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error in creating customer");
  }
});

RoutesCustomer.get(
  "/cliente/page", 
  async (req: Request, res: Response) => {
  const page = (req.query.page as string) || '0';
  const limit = (req.query.limit as string) || '10';
  const includeRelations = req.query.include === "true" ? true : false;
  const salaoId = req.query.salaoId as string || '';

  try {
    const clientes = await getClientePage(page, limit, includeRelations, salaoId);
    res.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

RoutesCustomer.put(
  "/cliente/:id", 
  async (req: Request, res: Response) => {
  const { id } = req.params;
  const { CPF, Nome, Email, Telefone, SalaoId } = req.body;
  const clienteData = {
    CPF,
    Nome,
    Email,
    Telefone,
    SalaoId,
  };
  try {
    const cliente = await updateCliente(id, clienteData);
    res.status(200).json(cliente);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});


RoutesCustomer.get(
  "/cliente/cpf/:cpf/:salaoId", 
  async (req, res) => {
  const { cpf, salaoId } = req.params;
  try {
    const cliente = await getClienteByCPF(cpf, salaoId);
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(204).json({ message: "Cliente não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }

});

RoutesCustomer.delete(
  "/cliente/:id", 
  async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await deleteCliente(id);
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(204).json({ message: "Cliente não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});
//Todas as outras funções vão usar a função de authenticate no Service para verificar se o usuário é quem diz ser, pra depois permitir.
export default RoutesCustomer;
