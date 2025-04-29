import { Request, Response } from "express";
import argon2 from "argon2";
import "dotenv/config";
import {
  createLogin,
  findLoginbyEmail,
  findLoginbyUserId,
  updateLogin,
} from "./Service";
import { userTypes } from "@prisma/client";

const SALT = process.env.SALT;
const SECRET_KEY = process.env.SECRET_KEY;
const HashPassword = async (password: string) => {
  try {
    let hash = await argon2.hash(password + SALT);
    return hash;
  } catch (e) {
    console.log(e);
  }
};

export const registerLogin = async (
  userID: string,
  email: string,
  password: string,
  salaoId: string,
  userType: string
) => {
  let hashed = await HashPassword(password);
  if (hashed) {
    let created = await createLogin(salaoId, userID, hashed, email, userType);
    return created;
  }
};

export const verifyPasswordAndReturnToken = async (
  email: string,
  password: string,
  salaoID: string
) => {
  console.log("Email:", email);
  console.log("SalaoId:", salaoID);

  let login = await findLoginbyEmail(email, salaoID);
  if (login) {
    let match = await argon2.verify(login.Senha, password + SALT);
    if (match) {
      const Token = generateRandomToken();
      await updateLogin(
        login.UsuarioID,
        login.Senha,
        login.Email,
        login.SalaoId,
        Token
      );
      return { token: Token, userID: login.UsuarioID, userType: login.Type };
    }
  }
};

const generateRandomToken = () => {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};

export const verifyTokenAndRefresh = async (
  token: string,
  userID: string,
  userType: string
) => {
  let login = await findLoginbyUserId(userID);
  if (login?.Token === token && login?.Type === userType) {
    const Token = generateRandomToken();
    await updateLogin(
      login.UsuarioID,
      login.Senha,
      login.Email,
      login.SalaoId,
      Token
    );
    return { token: Token, userID: userID, userType: login.Type };
  }
};
