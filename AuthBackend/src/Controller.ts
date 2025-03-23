import { Request, Response } from "express";
import argon2 from "argon2";
import "dotenv/config";
import { createLogin, findLogin, updateLogin } from "./Service";

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
  salaoID: string
) => {
  let hashed = await HashPassword(password);
  if (hashed) {
    let created = createLogin(salaoID, userID, hashed, email);
    return created;
  }
};

export const verifyPasswordAndReturnToken = async (
  email: string,
  password: string,
  salaoID: string
) => {
  let login = await findLogin(email, salaoID);
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
      return Token;
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
