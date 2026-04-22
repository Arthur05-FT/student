"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const errors_1 = require("../common/errors");
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
};
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: safeUserSelect,
        });
        if (!user)
            throw new errors_1.AppError("Utilisateur introuvable.", "NOT_FOUND");
        return user;
    }
    async updateProfile(userId, dto) {
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
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2002: "Cet email ou téléphone est déjà utilisé.",
                P2025: "Utilisateur introuvable.",
                default: "Erreur lors de la mise à jour du profil.",
            });
        }
    }
    listMembers(schoolId, query) {
        return this.prisma.userSchool.findMany({
            where: {
                schoolId,
                ...(query.search
                    ? {
                        user: {
                            OR: [
                                { name: { contains: query.search, mode: "insensitive" } },
                                { email: { contains: query.search, mode: "insensitive" } },
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
    async updateMembershipRole(schoolId, requestingUserId, targetUserId, role) {
        if (targetUserId === requestingUserId) {
            throw new errors_1.AppError("Vous ne pouvez pas modifier votre propre rôle.", "FORBIDDEN");
        }
        try {
            return await this.prisma.userSchool.update({
                where: { userId_schoolId: { userId: targetUserId, schoolId } },
                data: { role },
                select: { id: true, role: true },
            });
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2025: "Membre introuvable.",
                default: "Erreur lors de la mise à jour du rôle.",
            });
        }
    }
    async removeMembership(schoolId, requestingUserId, targetUserId) {
        if (targetUserId === requestingUserId) {
            throw new errors_1.AppError("Vous ne pouvez pas vous retirer vous-même.", "FORBIDDEN");
        }
        try {
            await this.prisma.userSchool.delete({
                where: { userId_schoolId: { userId: targetUserId, schoolId } },
            });
            return { ok: true };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2025: "Membre introuvable.",
                default: "Erreur lors du retrait du membre.",
            });
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map