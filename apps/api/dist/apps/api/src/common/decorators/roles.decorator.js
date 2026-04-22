"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLES = exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = "roles";
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
exports.ROLES = {
    ALL: ["SUPER_ADMIN", "DIRECTOR", "ADMIN", "TEACHER"],
    STAFF: ["SUPER_ADMIN", "DIRECTOR", "ADMIN"],
    ADMINS: ["SUPER_ADMIN", "DIRECTOR"],
    DIRECTOR_ONLY: ["SUPER_ADMIN", "DIRECTOR"],
};
//# sourceMappingURL=roles.decorator.js.map