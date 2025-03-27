import prisma from "../config/database";
class UserModel {
  static async getAllUsers() {
    return await prisma.user.findMany();
  }
  static async createUser(data: { nome: string; email: string; senha: string }) {
    return await prisma.user.create({ data });
  }
}
export default UserModel;
