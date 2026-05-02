import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { handlePrismaError, AppError } from "../common/errors";
import { CreateTeacherDto, UpdateTeacherDto } from "../schemas/teacher.schema";

const teacherSelect = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  phone: true,
  schoolId: true,
  createdAt: true,
  updatedAt: true,
} as const;

const normalize = (s?: string | null): string | null =>
  s ? s.toLowerCase().trim() : null;

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  list(schoolId: string) {
    return this.prisma.teacher.findMany({
      where: { schoolId },
      select: teacherSelect,
      orderBy: { lastname: "asc" },
    });
  }

  async findById(schoolId: string, id: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id, schoolId },
      select: teacherSelect,
    });
    if (!teacher) throw new AppError("Professeur introuvable.", "NOT_FOUND");
    return teacher;
  }

  async create(schoolId: string, dto: CreateTeacherDto) {
    try {
      return await this.prisma.teacher.create({
        data: {
          firstname: normalize(dto.firstname)!,
          lastname: normalize(dto.lastname)!,
          email: dto.email ?? null,
          phone: dto.phone ?? null,
          schoolId,
        },
        select: teacherSelect,
      });
    } catch (error) {
      throw handlePrismaError(error, {
        default: "Erreur lors de la création du professeur.",
      });
    }
  }

  async update(schoolId: string, id: string, dto: UpdateTeacherDto) {
    try {
      return await this.prisma.teacher.update({
        where: { id, schoolId },
        data: {
          ...(dto.firstname !== undefined && {
            firstname: normalize(dto.firstname)!,
          }),
          ...(dto.lastname !== undefined && {
            lastname: normalize(dto.lastname)!,
          }),
          ...(dto.email !== undefined && { email: dto.email }),
          ...(dto.phone !== undefined && { phone: dto.phone }),
        },
        select: teacherSelect,
      });
    } catch (error) {
      throw handlePrismaError(error, {
        P2025: "Professeur introuvable.",
        default: "Erreur lors de la mise à jour du professeur.",
      });
    }
  }

  async delete(schoolId: string, id: string) {
    try {
      await this.prisma.teacher.delete({ where: { id, schoolId } });
      return { ok: true as const };
    } catch (error) {
      throw handlePrismaError(error, {
        P2025: "Professeur introuvable.",
        default: "Erreur lors de la suppression du professeur.",
      });
    }
  }
}
