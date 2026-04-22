"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const errors_1 = require("../errors");
const APP_ERROR_TO_STATUS = {
    UNAUTHORIZED: common_1.HttpStatus.UNAUTHORIZED,
    FORBIDDEN: common_1.HttpStatus.FORBIDDEN,
    NOT_FOUND: common_1.HttpStatus.NOT_FOUND,
    CONFLICT: common_1.HttpStatus.CONFLICT,
    VALIDATION: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
    INTERNAL: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
};
let AppExceptionFilter = AppExceptionFilter_1 = class AppExceptionFilter {
    logger = new common_1.Logger(AppExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        if (exception instanceof errors_1.AppError) {
            const status = APP_ERROR_TO_STATUS[exception.code];
            res.status(status).json({
                statusCode: status,
                code: exception.code,
                message: exception.message,
            });
            return;
        }
        if (exception instanceof zod_1.ZodError) {
            res.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY).json({
                statusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                code: "VALIDATION",
                message: "Validation échouée",
                issues: exception.issues,
            });
            return;
        }
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const body = exception.getResponse();
            res.status(status).json(typeof body === "string" ? { message: body } : body);
            return;
        }
        this.logger.error("Unhandled exception", exception);
        res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            code: "INTERNAL",
            message: "Erreur interne du serveur",
        });
    }
};
exports.AppExceptionFilter = AppExceptionFilter;
exports.AppExceptionFilter = AppExceptionFilter = AppExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], AppExceptionFilter);
//# sourceMappingURL=app-exception.filter.js.map