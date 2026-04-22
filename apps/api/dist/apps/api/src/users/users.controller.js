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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const session_guard_1 = require("../common/guards/session.guard");
const membership_guard_1 = require("../common/guards/membership.guard");
const session_decorator_1 = require("../common/decorators/session.decorator");
const membership_decorator_1 = require("../common/decorators/membership.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
const user_schema_1 = require("../schemas/user.schema");
let UsersController = class UsersController {
    users;
    constructor(users) {
        this.users = users;
    }
    me(session) {
        return this.users.findById(session.userId);
    }
    updateMe(session, body) {
        return this.users.updateProfile(session.userId, body);
    }
    listMembers(m, query) {
        return this.users.listMembers(m.schoolId, query);
    }
    updateMemberRole(m, targetUserId, body) {
        return this.users.updateMembershipRole(m.schoolId, m.userId, targetUserId, body.role);
    }
    removeMember(m, targetUserId) {
        return this.users.removeMembership(m.schoolId, m.userId, targetUserId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)("me"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, session_decorator_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "me", null);
__decorate([
    (0, common_1.Patch)("me"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, session_decorator_1.Session)()),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(user_schema_1.updateUserProfileSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)("schools/:schoolSlug/members"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard, membership_guard_1.MembershipGuard),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Query)(new zod_validation_pipe_1.ZodValidationPipe(user_schema_1.listSchoolMembersSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "listMembers", null);
__decorate([
    (0, common_1.Patch)("schools/:schoolSlug/members/:targetUserId"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard, membership_guard_1.MembershipGuard),
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ROLES.DIRECTOR_ONLY),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Param)("targetUserId")),
    __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(user_schema_1.updateMembershipRoleSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMemberRole", null);
__decorate([
    (0, common_1.Delete)("schools/:schoolSlug/members/:targetUserId"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard, membership_guard_1.MembershipGuard),
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ROLES.DIRECTOR_ONLY),
    __param(0, (0, membership_decorator_1.CurrentMembership)()),
    __param(1, (0, common_1.Param)("targetUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "removeMember", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map