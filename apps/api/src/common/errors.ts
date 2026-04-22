export type AppErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION"
  | "INTERNAL";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: AppErrorCode = "INTERNAL",
  ) {
    super(message);
    this.name = "AppError";
  }
}

interface PrismaKnownError {
  code: string;
  meta?: Record<string, unknown>;
}

const isPrismaKnownError = (e: unknown): e is PrismaKnownError =>
  typeof e === "object" &&
  e !== null &&
  "code" in e &&
  typeof (e as { code: unknown }).code === "string";

export const handlePrismaError = (
  error: unknown,
  messages: { default: string } & Partial<Record<string, string>>,
): AppError => {
  if (isPrismaKnownError(error)) {
    const msg = messages[error.code];
    if (msg) {
      const code: AppErrorCode = error.code === "P2002" ? "CONFLICT" : "INTERNAL";
      return new AppError(msg, code);
    }
  }
  return new AppError(messages.default, "INTERNAL");
};
