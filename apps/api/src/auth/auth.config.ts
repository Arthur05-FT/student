import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { i18n } from "@better-auth/i18n";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, autoSignIn: false },
  trustedOrigins: [process.env.WEB_ORIGIN ?? "http://localhost:3000"],
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/email") {
        const body = ctx.body as { email: string };
        const user = await prisma.user.findUnique({
          where: { email: body.email },
          select: { status: true },
        });
        if (user?.status === "SUSPENDED") {
          throw new APIError("FORBIDDEN", {
            message: "Votre compte a été suspendu.",
          });
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
    i18n({
      defaultLocale: "fr",
      translations: {
        fr: {
          USER_NOT_FOUND: "Identifiant ou mot de passe incorrect",
          INVALID_EMAIL_OR_PASSWORD: "Identifiant ou mot de passe incorrect",
          USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
            "Un compte avec cet email ou numéro de téléphone existe déjà",
          FORBIDDEN: "Accès refusé",
          SESSION_EXPIRED: "Votre session a expiré, veuillez vous reconnecter",
        },
      },
    }),
  ],
});

export type Auth = typeof auth;
