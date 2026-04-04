import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { i18n } from "@better-auth/i18n";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
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
            message: "Votre compte a été suspendue.",
          });
        }
      }
    }),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  rateLimit: {
    enabled: true,
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
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
