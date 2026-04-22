"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listStudentsSchema = exports.updateStudentSchema = exports.createStudentSchema = void 0;
const zod_1 = require("zod");
const baseStudent = {
    matricule: zod_1.z.string().min(1).max(40),
    firstname: zod_1.z.string().min(1).max(80),
    lastname: zod_1.z.string().min(1).max(80),
    email: zod_1.z.string().email().or(zod_1.z.literal("")).optional(),
    phone: zod_1.z
        .string()
        .regex(/^\+?[0-9\s().-]{8,20}$/)
        .or(zod_1.z.literal(""))
        .optional(),
    classId: zod_1.z.string().uuid().nullable().optional(),
    average: zod_1.z.number().min(0).max(20).nullable().optional(),
};
exports.createStudentSchema = zod_1.z.object(baseStudent);
exports.updateStudentSchema = zod_1.z.object(baseStudent);
exports.listStudentsSchema = zod_1.z.object({
    classId: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().trim().optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
//# sourceMappingURL=student.schema.js.map