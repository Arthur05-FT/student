"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchoolSchema = exports.createSchoolSchema = void 0;
const zod_1 = require("zod");
const optionalEmail = zod_1.z
    .string()
    .email({ message: "Email invalide" })
    .or(zod_1.z.literal(""))
    .optional();
exports.createSchoolSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Nom de l'école requis" }),
    email: optionalEmail,
    city: zod_1.z.string().min(1, { message: "Ville de l'école requise" }),
    country: zod_1.z.string().min(1, { message: "Pays de l'école requis" }),
    type: zod_1.z.string().min(1, { message: "Type d'école requis" }),
});
exports.updateSchoolSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    email: optionalEmail,
    city: zod_1.z.string().min(1).optional(),
    country: zod_1.z.string().min(1).optional(),
    type: zod_1.z.string().min(1).optional(),
    onboardingCompleted: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=school.schema.js.map