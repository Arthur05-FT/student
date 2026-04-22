import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { handlePrismaError, AppError } from "../common/errors";
import {
  CreateStudentDto,
  ListStudentsQuery,
  UpdateStudentDto,
} from "../schemas/student.schema";

const studentSelect = {
  id: true,
  matricule: true,
  firstname: true,
  lastname: true,
  email: true,
  phone: true,
  average: true,
  classId: true,
  schoolId: true,
  createdAt: true,
  updatedAt: true,
  class: { select: { id: true, name: true } },
} as const;

const normalizeOptional = (v?: string | null): string | null =>
  v && v.trim() ? v.trim() : null;

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertClassBelongsToSchool(
    classId: string | null | undefined,
    schoolId: string,
  ) {
    if (!classId) return;
    const cls = await this.prisma.classes.findFirst({
      where: { id: classId, schoolId },
      select: { id: true },
    });
    if (!cls) {
      throw new AppError(
        "La classe sélectionnée n'appartient pas à cette école.",
        "VALIDATION",
      );
    }
  }

  async list(schoolId: string, query: ListStudentsQuery) {
    const where = {
      schoolId,
      ...(query.classId ? { classId: query.classId } : {}),
      ...(query.search
        ? {
            OR: [
              { firstname: { contains: query.search, mode: "insensitive" as const } },
              { lastname: { contains: query.search, mode: "insensitive" as const } },
              { matricule: { contains: query.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        select: studentSelect,
        orderBy: [{ lastname: "asc" }, { firstname: "asc" }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.student.count({ where }),
    ]);

    return { items, total, page: query.page, pageSize: query.pageSize };
  }

  async findById(schoolId: string, id: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, schoolId },
      select: studentSelect,
    });
    if (!student) throw new AppError("Étudiant introuvable.", "NOT_FOUND");
    return student;
  }

  async create(schoolId: string, dto: CreateStudentDto) {
    await this.assertClassBelongsToSchool(dto.classId ?? null, schoolId);
    try {
      return await this.prisma.student.create({
        data: {
          schoolId,
          matricule: dto.matricule,
          firstname: dto.firstname,
          lastname: dto.lastname,
          email: normalizeOptional(dto.email),
          phone: normalizeOptional(dto.phone),
          average: dto.average ?? null,
          classId: dto.classId ?? null,
        },
        select: studentSelect,
      });
    } catch (error) {
      throw handlePrismaError(error, {
        P2002: "Un étudiant avec ce matricule existe déjà.",
        default: "Erreur lors de la création de l'étudiant.",
      });
    }
  }

  async update(schoolId: string, id: string, dto: UpdateStudentDto) {
    await this.assertClassBelongsToSchool(dto.classId ?? null, schoolId);
    try {
      return await this.prisma.student.update({
        where: { id, schoolId },
        data: {
          matricule: dto.matricule,
          firstname: dto.firstname,
          lastname: dto.lastname,
          email: normalizeOptional(dto.email),
          phone: normalizeOptional(dto.phone),
          average: dto.average ?? null,
          classId: dto.classId ?? null,
        },
        select: studentSelect,
      });
    } catch (error) {
      throw handlePrismaError(error, {
        P2002: "Un étudiant avec ce matricule existe déjà.",
        P2025: "Étudiant introuvable.",
        default: "Erreur lors de la mise à jour de l'étudiant.",
      });
    }
  }

  async delete(schoolId: string, id: string) {
    try {
      await this.prisma.student.delete({ where: { id, schoolId } });
      return { ok: true as const };
    } catch (error) {
      throw handlePrismaError(error, {
        P2025: "Étudiant introuvable.",
        default: "Erreur lors de la suppression de l'étudiant.",
      });
    }
  }
}
