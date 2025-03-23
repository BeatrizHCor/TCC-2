import { Request, Response } from "express";
import argon2 from "argon2";
import "dotenv/config";
import { createLogin } from "./Service";
const SALT = process.env.SALT;

const HashPassword = async (password: string) => {
  try {
    let hash = await argon2.hash(password + SALT);
    return hash;
  } catch (e) {
    console.log(e);
  }
};

export const postLogin = async (
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
