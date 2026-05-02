import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { handlePrismaError, AppError } from "../common/errors";
import { CreateClassesDto, UpdateClassesDto } from "../schemas/classes.schema";

const classesSelect = {
  id: true,
  code: true,
  level: true,
  name: true,
  room: true,
  building: true,
  capacity: true,
  headTeacherId: true,
  headTeacher: {
    select: { id: true, firstname: true, lastname: true },
  },
  schoolId: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { students: true } },
} as const;

const normalize = (s?: string | null): string | null =>
  s ? s.toLowerCase().trim() : null;

function generateCode(name: string): string {
  const prefix = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)),
  ).join("");
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${prefix}-${slug}`;
}

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  list(schoolId: string) {
    return this.prisma.classes.findMany({
      where: { schoolId },
      select: classesSelect,
      orderBy: [{ level: "asc" }, { name: "asc" }],
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
    const name = normalize(dto.name)!;
    const level = normalize(dto.level)!;

    try {
      return await this.prisma.classes.create({
        data: {
          code: generateCode(`${level}-${name}`),
          name,
          level,
          schoolId,
          headTeacherId: dto.headTeacherId ?? null,
          capacity: dto.capacity ?? null,
          room: normalize(dto.room),
          building: normalize(dto.building),
        },
        select: classesSelect,
      });
    } catch (error) {
      throw handlePrismaError(error, {
        P2002: "Une classe avec ce niveau et ce nom existe déjà dans cette école.",
        default: "Erreur lors de la création de la classe.",
      });
    }
  }

  async update(schoolId: string, id: string, dto: UpdateClassesDto) {
    try {
      return await this.prisma.classes.update({
        where: { id, schoolId },
        data: {
          ...(dto.name !== undefined && { name: normalize(dto.name)! }),
          ...(dto.level !== undefined && { level: normalize(dto.level)! }),
          ...(dto.headTeacherId !== undefined && {
            headTeacherId: dto.headTeacherId,
          }),
          ...(dto.capacity !== undefined && { capacity: dto.capacity }),
          ...(dto.room !== undefined && { room: normalize(dto.room) }),
          ...(dto.building !== undefined && {
            building: normalize(dto.building),
          }),
        },
        select: classesSelect,
      });
    } catch (error) {
      throw handlePrismaError(error, {
        P2002: "Une classe avec ce niveau et ce nom existe déjà dans cette école.",
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
