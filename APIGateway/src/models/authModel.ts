import { userTypes } from "./tipo-usuario.enum";

export interface AuthControl {
    usuarioID?: string;
    email: string;
    salaoId: string;
    senha: string;
    type: userTypes;
    token?: string;
  }