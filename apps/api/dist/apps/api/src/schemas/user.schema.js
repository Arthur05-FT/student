"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSchoolMembersSchema = exports.updateMembershipRoleSchema = exports.updateUserProfileSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../../../generated/prisma/enums");
exports.updateUserProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(120).optional(),
    image: zod_1.z.string().url().or(zod_1.z.literal("")).optional(),
    birthdate: zod_1.z.coerce.date().optional(),
    phone: zod_1.z
        .string()
        .regex(/^\+?[0-9\s().-]{8,20}$/)
        .or(zod_1.z.literal(""))
        .optional(),
});
exports.updateMembershipRoleSchema = zod_1.z.object({
    role: zod_1.z.nativeEnum(enums_1.UserRole),
});
exports.listSchoolMembersSchema = zod_1.z.object({
    search: zod_1.z.string().trim().optional(),
});
//# sourceMappingURL=user.schema.js.map