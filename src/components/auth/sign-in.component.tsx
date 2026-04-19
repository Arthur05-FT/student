"use client";

import { useSignIn } from "@/lib/hooks/use-auth";
import PasswordField from "./password-field.component";
import IdentifierField from "./identifier-field.component";
import AuthFormShell from "./auth-form-shell.component";

const SignInComponent = () => {
  const {
    register,
    handleSubmit,
    formState,
    onSubmit,
    betterAuthErrors,
    isSubmitting,
  } = useSignIn();

  return (
    <AuthFormShell
      title="Connectez-vous"
      description="Gérez, organisez et optimisez la gestion avec Skoul."
      submitLabel="Se connecter"
      isSubmitting={isSubmitting}
      serverError={betterAuthErrors}
      onSubmit={handleSubmit(onSubmit)}
      footerLink={{ href: "/sign-up", label: "Vous n'avez pas de compte?" }}
    >
      <IdentifierField register={register} formState={formState} />
      <PasswordField register={register} formState={formState} />
    </AuthFormShell>
  );
};

export default SignInComponent;
