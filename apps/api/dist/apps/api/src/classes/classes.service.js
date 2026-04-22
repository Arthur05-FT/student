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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const errors_1 = require("../common/errors");
const classesSelect = {
    id: true,
    name: true,
    schoolId: true,
    createdAt: true,
    updatedAt: true,
    _count: { select: { students: true } },
};
let ClassesService = class ClassesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(schoolId) {
        return this.prisma.classes.findMany({
            where: { schoolId },
            select: classesSelect,
            orderBy: { createdAt: "desc" },
        });
    }
    async findById(schoolId, id) {
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
        if (!cls)
            throw new errors_1.AppError("Classe introuvable.", "NOT_FOUND");
        return cls;
    }
    async create(schoolId, dto) {
        try {
            return await this.prisma.classes.create({
                data: { name: dto.name, schoolId },
                select: classesSelect,
            });
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2002: "Une classe avec ce nom existe déjà dans cette école.",
                default: "Erreur lors de la création de la classe.",
            });
        }
    }
    async update(schoolId, id, dto) {
        try {
            return await this.prisma.classes.update({
                where: { id, schoolId },
                data: { name: dto.name },
                select: classesSelect,
            });
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2002: "Une classe avec ce nom existe déjà dans cette école.",
                P2025: "Classe introuvable.",
                default: "Erreur lors de la mise à jour de la classe.",
            });
        }
    }
    async delete(schoolId, id) {
        try {
            await this.prisma.classes.delete({ where: { id, schoolId } });
            return { ok: true };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2025: "Classe introuvable.",
                default: "Erreur lors de la suppression de la classe.",
            });
        }
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map