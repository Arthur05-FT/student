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
exports.MembershipGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../errors");
const roles_decorator_1 = require("../decorators/roles.decorator");
let MembershipGuard = class MembershipGuard {
    prisma;
    reflector;
    constructor(prisma, reflector) {
        this.prisma = prisma;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const session = req.session;
        if (!session) {
            throw new errors_1.AppError("Veuillez vous reconnecter.", "UNAUTHORIZED");
        }
        const slug = req.params.schoolSlug;
        if (!slug) {
            throw new errors_1.AppError("Slug d'école manquant.", "VALIDATION");
        }
        const school = await this.prisma.school.findUnique({
            where: { slug },
            select: { id: true },
        });
        if (!school)
            throw new errors_1.AppError("École introuvable.", "NOT_FOUND");
        const membership = await this.prisma.userSchool.findUnique({
            where: { userId_schoolId: { userId: session.userId, schoolId: school.id } },
            select: { role: true },
        });
        if (!membership) {
            throw new errors_1.AppError("Accès refusé à cette école.", "FORBIDDEN");
        }
        req.membership = {
            userId: session.userId,
            schoolId: school.id,
            schoolSlug: slug,
            role: membership.role,
        };
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (requiredRoles && !requiredRoles.includes(membership.role)) {
            throw new errors_1.AppError("Vous n'avez pas les droits pour cette action.", "FORBIDDEN");
        }
        return true;
    }
};
exports.MembershipGuard = MembershipGuard;
exports.MembershipGuard = MembershipGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        core_1.Reflector])
], MembershipGuard);
//# sourceMappingURL=membership.guard.js.map