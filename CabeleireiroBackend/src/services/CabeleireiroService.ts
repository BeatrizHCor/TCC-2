import prisma from "../config/database";

class CabeleireiroService {
  static getCabeleireiros = async (
    skip: number | null = null,
    limit: number | null = null,
    include = false,
    salaoId: string | null = null
  ) => {
    return await prisma.cabeleireiro.findMany({
      ...(skip !== null ? { skip } : {}),
      ...(limit !== null ? { take: limit } : {}),
      ...(salaoId !== null ? { where: { SalaoId: salaoId } } : {}),
      ...(include
        ? {
            include: {
              Agendamentos: true,
            },
          }
        : {}),
    });
  };

  static getCabeleireiroPage = async (
    page = 1,
    limit = 10,
    includeRelations = false,
    salaoId: string | null = null
  ) => {
    const skip = (page - 1) * limit;

    const [total, cabeleireiros] = await Promise.all([
      CabeleireiroService.getCabeleireiros(null, null, false, salaoId),
      CabeleireiroService.getCabeleireiros(
        skip,
        limit,
        includeRelations,
        salaoId
      ),
    ]);

    return {
      total: total.length,
      page,
      limit,
      data: cabeleireiros,
    };
  };

  static findById = async (ID: string, include = false) => {
    try {
      return await prisma.cabeleireiro.findUnique({
        where: {
          ID,
        },
        ...(include
          ? {
              include: {
                Salao: true,
                Agendamentos: true,
              },
            }
          : {}),
      });
    } catch (e) {
      console.log(e);
      return false;
    }
  };
}

export default CabeleireiroService;
