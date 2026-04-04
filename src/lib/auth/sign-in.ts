import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SignInForm } from "../schemas/auth.schema";
import { authClient } from "./auth-client";

export async function signIn(
  formData: SignInForm,
  setBetterAuthErrors: (error: string) => void,
  router: AppRouterInstance,
  setIsSubmitting: (isSubmitting: boolean) => void,
) {
  const { data, error } = await authClient.signIn.email(
    {
      email: formData.identifier,
      password: formData.password,
      /**
       * remember the user session after the browser is closed.
       * @default true
       */
      rememberMe: true,
    },
    {
      onRequest: (ctx) => {
        setIsSubmitting(true);
      },
      onSuccess: async (ctx) => {
        router.push(`/schools`);
        setIsSubmitting(false);
      },
      onError: (ctx) => {
        setIsSubmitting(false);
        setBetterAuthErrors(ctx.error.message);
      },
    },
  );
}
