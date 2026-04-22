"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const api_1 = require("better-auth/api");
const i18n_1 = require("@better-auth/i18n");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../../../../generated/prisma/client");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
}
const prisma = new client_1.PrismaClient({ adapter: new adapter_pg_1.PrismaPg({ connectionString }) });
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma, { provider: "postgresql" }),
    emailAndPassword: { enabled: true, autoSignIn: false },
    trustedOrigins: process.env.WEB_ORIGIN ? [process.env.WEB_ORIGIN] : undefined,
    hooks: {
        before: (0, api_1.createAuthMiddleware)(async (ctx) => {
            if (ctx.path === "/sign-in/email") {
                const body = ctx.body;
                const user = await prisma.user.findUnique({
                    where: { email: body.email },
                    select: { status: true },
                });
                if (user?.status === "SUSPENDED") {
                    throw new api_1.APIError("FORBIDDEN", { message: "Votre compte a été suspendu." });
                }
            }
        }),
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: { enabled: true, maxAge: 60 * 5 },
    },
    rateLimit: { enabled: true, window: 10, max: 100 },
    plugins: [
        (0, i18n_1.i18n)({
            defaultLocale: "fr",
            translations: {
                fr: {
                    USER_NOT_FOUND: "Identifiant ou mot de passe incorrect",
                    INVALID_EMAIL_OR_PASSWORD: "Identifiant ou mot de passe incorrect",
                    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Un compte avec cet email ou numéro de téléphone existe déjà",
                    FORBIDDEN: "Accès refusé",
                    SESSION_EXPIRED: "Votre session a expiré, veuillez vous reconnecter",
                },
            },
        }),
    ],
});
//# sourceMappingURL=auth.config.js.map