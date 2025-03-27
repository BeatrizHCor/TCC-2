import { Request, Response } from "express";
import UserModel from "../models/userModel";
import userService from "../services/userService";
export const getAllUsers = async (req: Request, res: Response) =
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};
export const createUser = async (req: Request, res: Response) =
  try {
    const { nome, email, senha } = req.body;
    const senhaHash = await userService.hashPassword(senha);
    const novoUsuario = await UserModel.createUser({ nome, email, senha: senhaHash });
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar usuário" });
  }
};
