import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      firstName: { type: "string",  required: true,  input: true },
      lastName:  { type: "string",  required: true,  input: true },
      phone:     { type: "string",  required: false, input: true },
      role:      { type: "string",  required: true,  input: true, defaultValue: "OWNER" },
      language:  { type: "string",  required: false, input: true, defaultValue: "fr" },
      schoolId:  { type: "string",  required: false },
      isActive:  { type: "boolean", required: false, defaultValue: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: { ...user, name: `${user.firstName} ${user.lastName}` },
        }),
      },
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type !== "email-verification") return;
        // TODO: remplacer par Resend une fois la clé configurée
        console.log(`[OTP] ${email} → ${otp}`);
        /* const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.FROM_EMAIL ?? "noreply@educam.cm",
          to: email,
          subject: "Votre code de vérification EduCam",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto">
              <h2>Vérification de votre email</h2>
              <p>Votre code de vérification :</p>
              <div style="font-size:36px;font-weight:bold;letter-spacing:8px;padding:16px;background:#f4f4f5;text-align:center;border-radius:8px">
                ${otp}
              </div>
              <p style="color:#6b7280;font-size:14px">Ce code expire dans 5 minutes.</p>
            </div>
          `,
        }); */
      },
    }),
    nextCookies(),
  ],
});

export type Session  = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function requireRole(...roles: string[]) {
  const session = await requireSession();
  const userRole = (session.user as AuthUser & { role?: string }).role ?? "";
  if (!roles.includes(userRole)) throw new Error("FORBIDDEN");
  return session;
}
