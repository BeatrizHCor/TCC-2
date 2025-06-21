import { authenticate } from "../services/Service";
import { userTypes } from "../models/tipo-usuario.enum";

export async function getUserInfoAndAuth(headers: any) {
  const userInfo = JSON.parse(
    Buffer.from(headers.authorization || "", "base64").toString("utf-8") || "{}"
  );
  if (!userInfo || !userInfo.userID || !userInfo.token || !userInfo.userType) {
    return { userInfo: null, auth: false };
  }
  const auth = await authenticate(
    userInfo.userID,
    userInfo.token,
    userInfo.userType
  );
  return { userInfo, auth };
}