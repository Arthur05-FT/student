"use server";

import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { RegisterSchema, LoginSchema, OtpSchema, ForgotPasswordSchema, ResetPasswordSchema } from "@/lib/validations/auth";
import type { ActionResult } from "@/lib/types";

const ROLE_PREFIXES: Record<string, string> = {
  OWNER:       "owner",
  DIRECTOR:    "director",
  TEACHER:     "teacher",
  SUPER_ADMIN: "admin",
};

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Register ────────────────────────────────────────────────────────────────

export async function registerAction(
  _prev: unknown,
  formData: FormData,
): Promise<ActionResult<{ redirectTo: string }>> {
  const raw = {
    firstName:       formData.get("firstName"),
    lastName:        formData.get("lastName"),
    phone:           formData.get("phone"),
    email:           formData.get("email"),
    password:        formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, phone, email, password } = parsed.data;

  try {
    await auth.api.signUpEmail({
      body: { name: `${firstName} ${lastName}`, email, password, firstName, lastName, phone, role: "OWNER" },
    });

    await auth.api.sendVerificationOTP({
      body: { email, type: "email-verification" },
    });
  } catch (err) {
    if (err instanceof APIError) {
      if (err.status === "UNPROCESSABLE_ENTITY") {
        return { success: false, error: "Un compte existe déjà avec cet email." };
      }
      return { success: false, error: "Erreur d'inscription. Réessayez." };
    }
    console.error("[registerAction]", err);
    return { success: false, error: "Erreur serveur." };
  }

  return {
    success: true,
    data: { redirectTo: `/verify-email?email=${encodeURIComponent(email)}` },
  };
}

// ── Verify OTP ──────────────────────────────────────────────────────────────

export async function verifyOtpAction(
  _prev: unknown,
  formData: FormData,
): Promise<ActionResult<{ redirectTo: string }>> {
  const raw = {
    email: formData.get("email"),
    otp:   formData.get("otp"),
  };

  const parsed = OtpSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Code invalide",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await auth.api.verifyEmailOTP({
      body: { email: parsed.data.email, otp: parsed.data.otp },
    });

    const user     = result.user as { role?: string; firstName?: string; lastName?: string };
    const prefix   = ROLE_PREFIXES[user.role ?? "OWNER"] ?? "owner";
    const slug     = toSlug(`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim());

    return { success: true, data: { redirectTo: `/${prefix}/${slug}` } };
  } catch (err) {
    if (err instanceof APIError) {
      if (err.status === "BAD_REQUEST") {
        return { success: false, error: "Code incorrect ou expiré." };
      }
      return { success: false, error: "Erreur de vérification. Réessayez." };
    }
    console.error("[verifyOtpAction]", err);
    return { success: false, error: "Erreur serveur." };
  }
}

// ── Resend OTP ──────────────────────────────────────────────────────────────

export async function resendOtpAction(email: string): Promise<ActionResult> {
  try {
    await auth.api.sendVerificationOTP({
      body: { email, type: "email-verification" },
    });
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[resendOtpAction]", err);
    return { success: false, error: "Impossible de renvoyer le code." };
  }
}

// ── Login ───────────────────────────────────────────────────────────────────

export async function loginAction(
  _prev: unknown,
  formData: FormData,
): Promise<ActionResult<{ redirectTo: string }>> {
  const raw = {
    email:    formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const rememberMe = formData.get("remember") === "on";

  try {
    const result = await auth.api.signInEmail({
      body: { ...parsed.data, rememberMe },
    });

    const user = result.user as { role?: string; firstName?: string; lastName?: string };
    const role      = user.role ?? "OWNER";
    const prefix    = ROLE_PREFIXES[role] ?? "owner";
    const slug      = toSlug(`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim());
    const redirectTo = `/${prefix}/${slug}`;

    return { success: true, data: { redirectTo } };
  } catch (err) {
    if (err instanceof APIError) {
      if (err.status === "UNAUTHORIZED") {
        return { success: false, error: "Email ou mot de passe incorrect." };
      }
      if (err.status === "FORBIDDEN") {
        return {
          success: false,
          error: "Votre email n'a pas encore été vérifié.",
          meta: { unverifiedEmail: parsed.data.email },
        };
      }
      return { success: false, error: "Erreur de connexion. Réessayez." };
    }
    console.error("[loginAction]", err);
    return { success: false, error: "Erreur serveur." };
  }
}

// ── Forgot Password ─────────────────────────────────────────────────────────

export async function forgotPasswordAction(
  _prev: unknown,
  formData: FormData,
): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = ForgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { success: false, error: "Email invalide", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await auth.api.requestPasswordResetEmailOTP({ body: { email: parsed.data.email } });
  } catch (err) {
    console.error("[forgotPasswordAction]", err);
    return { success: false, error: "Erreur serveur." };
  }

  return {
    success: true,
    data: { redirectTo: `/reset-password?email=${encodeURIComponent(parsed.data.email)}` },
  };
}

// ── Reset Password ───────────────────────────────────────────────────────────

export async function resetPasswordAction(
  _prev: unknown,
  formData: FormData,
): Promise<ActionResult<{ redirectTo: string }>> {
  const raw = {
    email:           formData.get("email"),
    otp:             formData.get("otp"),
    password:        formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = ResetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Données invalides", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, otp, password } = parsed.data;

  try {
    await auth.api.resetPasswordEmailOTP({ body: { email, otp, password } });
  } catch (err) {
    if (err instanceof APIError && err.status === "BAD_REQUEST") {
      return { success: false, error: "Code incorrect ou expiré." };
    }
    console.error("[resetPasswordAction]", err);
    return { success: false, error: "Erreur serveur." };
  }

  return { success: true, data: { redirectTo: "/login" } };
}
