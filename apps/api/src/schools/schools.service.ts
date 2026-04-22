import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { handlePrismaError, AppError } from "../common/errors";
import { CreateSchoolDto, UpdateSchoolDto } from "../schemas/school.schema";

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const detailSelect = {
  id: true,
  name: true,
  slug: true,
  email: true,
  city: true,
  country: true,
  type: true,
  status: true,
  onboardingCompleted: true,
  classes: {
    select: { id: true, name: true, createdAt: true },
    orderBy: { createdAt: "desc" as const },
  },
  _count: { select: { students: true, classes: true, users: true } },
} as const;

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  listMine(userId: string) {
    return this.prisma.school.findMany({
      where: { users: { some: { userId } } },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        country: true,
        status: true,
        _count: { select: { students: true, classes: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  async findBySlug(slug: string) {
    const school = await this.prisma.school.findUnique({
      where: { slug },
      select: detailSelect,
    });
    if (!school) throw new AppError("École introuvable.", "NOT_FOUND");
    return school;
  }

  async create(userId: string, dto: CreateSchoolDto) {
    const slug = slugify(dto.name);
    try {
      return await this.prisma.school.create({
        data: {
          name: dto.name,
          email: dto.email?.trim() ? dto.email.trim() : null,
          slug,
          city: dto.city,
          country: dto.country,
          type: dto.type,
          users: { create: { userId, role: "DIRECTOR" } },
        },
        select: { id: true, name: true, slug: true },
      });
    } catch (error) {
      throw handlePrismaError(error, {
        P2002: "Une école avec ce nom existe déjà.",
        default: "Erreur lors de la création de l'école.",
      });
    }
  }

  async update(schoolId: string, currentSlug: string, dto: UpdateSchoolDto) {
    const nextSlug = dto.name ? slugify(dto.name) : undefined;
    try {
      return await this.prisma.school.update({
        where: { id: schoolId },
        data: {
          name: dto.name,
          slug: nextSlug,
          email:
            dto.email !== undefined
              ? dto.email.trim()
                ? dto.email.trim()
                : null
              : undefined,
          city: dto.city,
          country: dto.country,
          type: dto.type,
          onboardingCompleted: dto.onboardingCompleted,
        },
        select: detailSelect,
      });
    } catch (error) {
      throw handlePrismaError(error, {
        P2002: "Une école avec ce nom existe déjà.",
        P2025: "École introuvable.",
        default: "Erreur lors de la mise à jour de l'école.",
      });
    }
  }

  async delete(schoolId: string) {
    try {
      await this.prisma.school.delete({ where: { id: schoolId } });
      return { ok: true as const };
    } catch (error) {
      throw handlePrismaError(error, {
        P2025: "École introuvable.",
        default: "Erreur lors de la suppression de l'école.",
      });
    }
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: {
        role: true,
        schools: {
          select: { school: { select: { name: true, slug: true } } },
        },
      },
    });
    const firstSchool = user?.schools?.[0]?.school;
    return {
      schoolName: firstSchool?.name ?? null,
      schoolSlug: firstSchool?.slug ?? null,
      role: user?.role ?? null,
    };
  }
}
