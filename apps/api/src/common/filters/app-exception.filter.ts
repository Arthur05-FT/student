import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ZodError } from "zod";
import type { Response } from "express";
import { AppError, AppErrorCode } from "../errors";

const APP_ERROR_TO_STATUS: Record<AppErrorCode, HttpStatus> = {
  UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
  FORBIDDEN: HttpStatus.FORBIDDEN,
  NOT_FOUND: HttpStatus.NOT_FOUND,
  CONFLICT: HttpStatus.CONFLICT,
  VALIDATION: HttpStatus.UNPROCESSABLE_ENTITY,
  INTERNAL: HttpStatus.INTERNAL_SERVER_ERROR,
};

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof AppError) {
      const status = APP_ERROR_TO_STATUS[exception.code];
      res.status(status).json({
        statusCode: status,
        code: exception.code,
        message: exception.message,
      });
      return;
    }

    if (exception instanceof ZodError) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        code: "VALIDATION",
        message: "Validation échouée",
        issues: exception.issues,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      res.status(status).json(typeof body === "string" ? { message: body } : body);
      return;
    }

    this.logger.error("Unhandled exception", exception as Error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: "INTERNAL",
      message: "Erreur interne du serveur",
    });
  }
}
