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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("./students.service");
const session_guard_1 = require("../common/guards/session.guard");
const membership_guard_1 = require("../common/guards/membership.guard");
const membership_decorator_1 = require("../common/decorators/membership.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
const student_schema_1 = require("../schemas/student.schema");
let StudentsController = class StudentsController {
    students;
    constructor(students) {
        this.students = students;
    }
    list(m, query) {
        return this.students.list(m.schoolId, query);
    }
    findOne(m, id) {
        return this.students.findById(m.schoolId, id);
    }
    create(m, body) {
        return this.students.create(m.schoolId, body);
    }
    update(m, id, body) {
        return this.students.update(m.schoolId, id, body);
    }
    remove(m, id) {
        return this.students.delete(m.schoolId, id);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Query)(new zod_validation_pipe_1.ZodValidationPipe(student_schema_1.listStudentsSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ROLES.STAFF),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(student_schema_1.createStudentSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ROLES.STAFF),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(student_schema_1.updateStudentSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ROLES.STAFF),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "remove", null);
exports.StudentsController = StudentsController = __decorate([
    (0, common_1.Controller)("schools/:schoolSlug/students"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard, membership_guard_1.MembershipGuard),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map