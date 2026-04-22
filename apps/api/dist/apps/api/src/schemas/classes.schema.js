"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClassesSchema = exports.createClassesSchema = void 0;
const zod_1 = require("zod");
exports.createClassesSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Nom de la classe requis" }).max(80),
});
exports.updateClassesSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(80),
});
//# sourceMappingURL=classes.schema.js.map