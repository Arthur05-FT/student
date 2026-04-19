"use client";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/lib/hooks/use-auth";
import PasswordField from "./password-field.component";
import IdentifierField from "./identifier-field.component";
import AuthFormShell from "./auth-form-shell.component";

const SignUpComponent = () => {
  const {
    register,
    handleSubmit,
    formState,
    onSubmit,
    betterAuthErrors,
    isSubmitting,
  } = useSignUp();

  return (
    <AuthFormShell
      title="Inscrivez-vous"
      description="Gérez, organisez et optimisez la gestion avec Skoul."
      submitLabel="S'inscrire"
      isSubmitting={isSubmitting}
      serverError={betterAuthErrors}
      onSubmit={handleSubmit(onSubmit)}
      footerLink={{ href: "/sign-in", label: "Vous avez déjà un compte?" }}
    >
      <FieldGroup className="grid max-w-sm grid-cols-2">
        <Field>
          <FieldLabel htmlFor="firstname">Nom</FieldLabel>
          <Input
            id="firstname"
            type="text"
            placeholder="Entrez votre nom"
            {...register("firstname")}
            aria-invalid={formState.errors.firstname ? "true" : "false"}
          />
          {formState.errors.firstname && (
            <FieldError>{formState.errors.firstname.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="lastname">Prénom</FieldLabel>
          <Input
            id="lastname"
            type="text"
            placeholder="Entrez votre prénom"
            {...register("lastname")}
            aria-invalid={formState.errors.lastname ? "true" : "false"}
          />
          {formState.errors.lastname && (
            <FieldError>{formState.errors.lastname.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
      <IdentifierField register={register} formState={formState} />
      <PasswordField register={register} formState={formState} />
    </AuthFormShell>
  );
};

export default SignUpComponent;
