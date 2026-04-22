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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const errors_1 = require("../common/errors");
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
};
const normalizeOptional = (v) => v && v.trim() ? v.trim() : null;
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertClassBelongsToSchool(classId, schoolId) {
        if (!classId)
            return;
        const cls = await this.prisma.classes.findFirst({
            where: { id: classId, schoolId },
            select: { id: true },
        });
        if (!cls) {
            throw new errors_1.AppError("La classe sélectionnée n'appartient pas à cette école.", "VALIDATION");
        }
    }
    async list(schoolId, query) {
        const where = {
            schoolId,
            ...(query.classId ? { classId: query.classId } : {}),
            ...(query.search
                ? {
                    OR: [
                        { firstname: { contains: query.search, mode: "insensitive" } },
                        { lastname: { contains: query.search, mode: "insensitive" } },
                        { matricule: { contains: query.search, mode: "insensitive" } },
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
    async findById(schoolId, id) {
        const student = await this.prisma.student.findFirst({
            where: { id, schoolId },
            select: studentSelect,
        });
        if (!student)
            throw new errors_1.AppError("Étudiant introuvable.", "NOT_FOUND");
        return student;
    }
    async create(schoolId, dto) {
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
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2002: "Un étudiant avec ce matricule existe déjà.",
                default: "Erreur lors de la création de l'étudiant.",
            });
        }
    }
    async update(schoolId, id, dto) {
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
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2002: "Un étudiant avec ce matricule existe déjà.",
                P2025: "Étudiant introuvable.",
                default: "Erreur lors de la mise à jour de l'étudiant.",
            });
        }
    }
    async delete(schoolId, id) {
        try {
            await this.prisma.student.delete({ where: { id, schoolId } });
            return { ok: true };
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error, {
                P2025: "Étudiant introuvable.",
                default: "Erreur lors de la suppression de l'étudiant.",
            });
        }
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map