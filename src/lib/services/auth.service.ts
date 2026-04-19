import { SignInForm, SignUpForm } from "../schemas/auth.schema";
import { authClient } from "../auth-client";

export type AuthResult = { ok: true } | { ok: false; error: string };

export async function signInService(formData: SignInForm): Promise<AuthResult> {
  const { error } = await authClient.signIn.email({
    email: formData.identifier,
    password: formData.password,
    rememberMe: true,
  });

  if (error) return { ok: false, error: error.message ?? "Erreur de connexion" };
  return { ok: true };
}

export async function signUpService(formData: SignUpForm): Promise<AuthResult> {
  const { error } = await authClient.signUp.email({
    email: formData.identifier,
    password: formData.password,
    name: `${formData.firstname} ${formData.lastname}`,
    callbackURL: "/sign-in",
  });

  if (error) return { ok: false, error: error.message ?? "Erreur d'inscription" };
  return { ok: true };
}

export async function signOutService(): Promise<void> {
  await authClient.signOut();
}
