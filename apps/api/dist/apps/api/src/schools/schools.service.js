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
exports.SchoolsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const errors_1 = require("../common/errors");
const slugify = (input) => input
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
        orderBy: { createdAt: "desc" },
    },
    _count: { select: { students: true, classes: true, users: true } },
};
let SchoolsService = class SchoolsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listMine(userId) {
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
    async findBySlug(slug) {
        const school = await this.prisma.school.findUnique({
            where: { slug },
            select: detailSelect,
        });
        if (!school)
            throw new errors_1.AppError("École introuvable.", "NOT_FOUND");
        return school;
    }
    async create(userId, dto) {
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
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2002: "Une école avec ce nom existe déjà.",
                default: "Erreur lors de la création de l'école.",
            });
        }
    }
    async update(schoolId, currentSlug, dto) {
        const nextSlug = dto.name ? slugify(dto.name) : undefined;
        try {
            return await this.prisma.school.update({
                where: { id: schoolId },
                data: {
                    name: dto.name,
                    slug: nextSlug,
                    email: dto.email !== undefined
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
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2002: "Une école avec ce nom existe déjà.",
                P2025: "École introuvable.",
                default: "Erreur lors de la mise à jour de l'école.",
            });
        }
    }
    async delete(schoolId) {
        try {
            await this.prisma.school.delete({ where: { id: schoolId } });
            return { ok: true };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2025: "École introuvable.",
                default: "Erreur lors de la suppression de l'école.",
            });
        }
    }
    async findByEmail(email) {
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
};
exports.SchoolsService = SchoolsService;
exports.SchoolsService = SchoolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchoolsService);
//# sourceMappingURL=schools.service.js.map