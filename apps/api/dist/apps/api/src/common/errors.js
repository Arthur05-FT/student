"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = exports.AppError = void 0;
class AppError extends Error {
    code;
    constructor(message, code = "INTERNAL") {
        super(message);
        this.code = code;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
const isPrismaKnownError = (e) => typeof e === "object" &&
    e !== null &&
    "code" in e &&
    typeof e.code === "string";
const handlePrismaError = (error, messages) => {
    if (isPrismaKnownError(error)) {
        const msg = messages[error.code];
        if (msg) {
            const code = error.code === "P2002" ? "CONFLICT" : "INTERNAL";
            return new AppError(msg, code);
        }
    }
    return new AppError(messages.default, "INTERNAL");
};
exports.handlePrismaError = handlePrismaError;
//# sourceMappingURL=errors.js.map