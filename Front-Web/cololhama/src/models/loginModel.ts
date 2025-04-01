import { userTypes } from "./tipo-usuario.enum";

export interface IAuthControl {
    usuarioID: string;
    email: string;
    salaoId: string;
    senha: string;
    type: userTypes;
    token?: string;
  }