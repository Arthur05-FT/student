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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolsController = void 0;
const common_1 = require("@nestjs/common");
const schools_service_1 = require("./schools.service");
const session_guard_1 = require("../common/guards/session.guard");
const membership_guard_1 = require("../common/guards/membership.guard");
const session_decorator_1 = require("../common/decorators/session.decorator");
const membership_decorator_1 = require("../common/decorators/membership.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
const school_schema_1 = require("../schemas/school.schema");
let SchoolsController = class SchoolsController {
    schools;
    constructor(schools) {
        this.schools = schools;
    }
    list(session) {
        return this.schools.listMine(session.userId);
    }
    lookupByEmail(email) {
        return this.schools.findByEmail(email);
    }
    create(session, body) {
        return this.schools.create(session.userId, body);
    }
    detail(membership) {
        return this.schools.findBySlug(membership.schoolSlug);
    }
    update(membership, body) {
        return this.schools.update(membership.schoolId, membership.schoolSlug, body);
    }
    remove(membership) {
        return this.schools.delete(membership.schoolId);
    }
};
exports.SchoolsController = SchoolsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, session_decorator_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("lookup-by-email"),
    __param(0, (0, common_1.Query)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "lookupByEmail", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(school_schema_1.createSchoolSchema)),
    __param(0, (0, session_decorator_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":schoolSlug"),
    (0, common_1.UseGuards)(membership_guard_1.MembershipGuard),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "detail", null);
__decorate([
    (0, common_1.Patch)(":schoolSlug"),
    (0, common_1.UseGuards)(membership_guard_1.MembershipGuard),
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ROLES.ADMINS),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(school_schema_1.updateSchoolSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":schoolSlug"),
    (0, common_1.UseGuards)(membership_guard_1.MembershipGuard),
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ROLES.DIRECTOR_ONLY),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "remove", null);
exports.SchoolsController = SchoolsController = __decorate([
    (0, common_1.Controller)("schools"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __metadata("design:paramtypes", [schools_service_1.SchoolsService])
], SchoolsController);
//# sourceMappingURL=schools.controller.js.map