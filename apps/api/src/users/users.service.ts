import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { handlePrismaError, AppError } from "../common/errors";
import {
  ListSchoolMembersQuery,
  UpdateMembershipRoleDto,
  UpdateUserProfileDto,
} from "../schemas/user.schema";
import type { UserRole } from "../generated/prisma/enums";

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  role: true,
  status: true,
  isActive: true,
  emailVerified: true,
  birthdate: true,
  createdAt: true,
  updatedAt: true,
  schools: {
    select: {
      id: true,
      schoolId: true,
      role: true,
      joinedAt: true,
      school: { select: { id: true, name: true, slug: true, status: true } },
    },
  },
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });
    if (!user) throw new AppError("Utilisateur introuvable.", "NOT_FOUND");
    return user;
  }

  async updateProfile(userId: string, dto: UpdateUserProfileDto) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: dto.name,
          image: dto.image !== undefined ? dto.image || null : undefined,
          phone: dto.phone !== undefined ? dto.phone || null : undefined,
          birthdate: dto.birthdate,
        },
        select: safeUserSelect,
      });
    } catch (error) {
      throw handlePrismaError(error, {
        P2002: "Cet email ou téléphone est déjà utilisé.",
        P2025: "Utilisateur introuvable.",
        default: "Erreur lors de la mise à jour du profil.",
      });
    }
  }

  listMembers(schoolId: string, query: ListSchoolMembersQuery) {
    return this.prisma.userSchool.findMany({
      where: {
        schoolId,
        ...(query.search
          ? {
              user: {
                OR: [
                  { name: { contains: query.search, mode: "insensitive" as const } },
                  { email: { contains: query.search, mode: "insensitive" as const } },
                ],
              },
            }
          : {}),
      },
      select: {
        id: true,
        role: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            status: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });
  }

  async updateMembershipRole(
    schoolId: string,
    requestingUserId: string,
    targetUserId: string,
    role: UserRole,
  ) {
    if (targetUserId === requestingUserId) {
      throw new AppError("Vous ne pouvez pas modifier votre propre rôle.", "FORBIDDEN");
    }
    try {
      return await this.prisma.userSchool.update({
        where: { userId_schoolId: { userId: targetUserId, schoolId } },
        data: { role },
        select: { id: true, role: true },
      });
    } catch (error) {
      throw handlePrismaError(error, {
        P2025: "Membre introuvable.",
        default: "Erreur lors de la mise à jour du rôle.",
      });
    }
  }

  async removeMembership(
    schoolId: string,
    requestingUserId: string,
    targetUserId: string,
  ) {
    if (targetUserId === requestingUserId) {
      throw new AppError("Vous ne pouvez pas vous retirer vous-même.", "FORBIDDEN");
    }
    try {
      await this.prisma.userSchool.delete({
        where: { userId_schoolId: { userId: targetUserId, schoolId } },
      });
      return { ok: true as const };
    } catch (error) {
      throw handlePrismaError(error, {
        P2025: "Membre introuvable.",
        default: "Erreur lors du retrait du membre.",
      });
    }
  }
}
