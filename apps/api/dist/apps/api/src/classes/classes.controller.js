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
exports.ClassesController = void 0;
const common_1 = require("@nestjs/common");
const classes_service_1 = require("./classes.service");
const session_guard_1 = require("../common/guards/session.guard");
const membership_guard_1 = require("../common/guards/membership.guard");
const membership_decorator_1 = require("../common/decorators/membership.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
const classes_schema_1 = require("../schemas/classes.schema");
let ClassesController = class ClassesController {
    classes;
    constructor(classes) {
        this.classes = classes;
    }
    list(m) {
        return this.classes.list(m.schoolId);
    }
    findOne(m, id) {
        return this.classes.findById(m.schoolId, id);
    }
    create(m, body) {
        return this.classes.create(m.schoolId, body);
    }
    update(m, id, body) {
        return this.classes.update(m.schoolId, id, body);
    }
    remove(m, id) {
        return this.classes.delete(m.schoolId, id);
    }
};
exports.ClassesController = ClassesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ROLES.STAFF),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(classes_schema_1.createClassesSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ROLES.STAFF),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(classes_schema_1.updateClassesSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ROLES.ADMINS),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "remove", null);
exports.ClassesController = ClassesController = __decorate([
    (0, common_1.Controller)("schools/:schoolSlug/classes"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard, membership_guard_1.MembershipGuard),
    __metadata("design:paramtypes", [classes_service_1.ClassesService])
], ClassesController);
//# sourceMappingURL=classes.controller.js.map