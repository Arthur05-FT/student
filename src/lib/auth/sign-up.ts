import { authClient } from "@/lib/auth/auth-client"; //import the auth client
import { SignUpForm } from "../schemas/auth.schema";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function signUp(
  formData: SignUpForm,
  setBetterAuthErrors: (error: string) => void,
  router: AppRouterInstance,
  setIsSubmitting: (isSubmitting: boolean) => void,
) {
  const { data, error } = await authClient.signUp.email(
    {
      email: formData.identifier, // user email address
      password: formData.password, // user password -> min 8 characters by default
      name: formData.firstname + " " + formData.lastname, // user display name
      callbackURL: "/sign-in", // A URL to redirect to after the user verifies their email (optional)
    },
    {
      onRequest: (ctx) => {
        //show loading
        setIsSubmitting(true);
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
        router.push("/sign-in");
        setIsSubmitting(false);
      },
      onError: (ctx) => {
        // display the error message
        console.error("Sign-up error:", ctx.error);
        setBetterAuthErrors(ctx.error.message);
        setIsSubmitting(false);
      },
    },
  );
}
