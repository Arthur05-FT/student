import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { handlePrismaError, AppError } from "../common/errors";
import { CreateClassesDto, UpdateClassesDto } from "../schemas/classes.schema";

const classesSelect = {
  id: true,
  name: true,
  schoolId: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { students: true } },
} as const;

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  list(schoolId: string) {
    return this.prisma.classes.findMany({
      where: { schoolId },
      select: classesSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(schoolId: string, id: string) {
    const cls = await this.prisma.classes.findFirst({
      where: { id, schoolId },
      select: {
        ...classesSelect,
        students: {
          select: {
            id: true,
            matricule: true,
            firstname: true,
            lastname: true,
            average: true,
          },
          orderBy: { lastname: "asc" },
        },
      },
    });
    if (!cls) throw new AppError("Classe introuvable.", "NOT_FOUND");
    return cls;
  }

  async create(schoolId: string, dto: CreateClassesDto) {
    try {
      return await this.prisma.classes.create({
        data: { name: dto.name, schoolId },
        select: classesSelect,
      });
    } catch (error) {
      throw handlePrismaError(error, {
        P2002: "Une classe avec ce nom existe déjà dans cette école.",
        default: "Erreur lors de la création de la classe.",
      });
    }
  }

  async update(schoolId: string, id: string, dto: UpdateClassesDto) {
    try {
      return await this.prisma.classes.update({
        where: { id, schoolId },
        data: { name: dto.name },
        select: classesSelect,
      });
    } catch (error) {
      throw handlePrismaError(error, {
        P2002: "Une classe avec ce nom existe déjà dans cette école.",
        P2025: "Classe introuvable.",
        default: "Erreur lors de la mise à jour de la classe.",
      });
    }
  }

  async delete(schoolId: string, id: string) {
    try {
      await this.prisma.classes.delete({ where: { id, schoolId } });
      return { ok: true as const };
    } catch (error) {
      throw handlePrismaError(error, {
        P2025: "Classe introuvable.",
        default: "Erreur lors de la suppression de la classe.",
      });
    }
  }
}
