"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSignIn } from "@/lib/hooks/useAuth";
import SubmitButton from "../shared/submit-button";
import PasswordField from "./password-field";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={"max-w-sm mx-auto relative"}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend className="font-bold">Connectez-vous</FieldLegend>
          <FieldDescription>
            Gérez, organisez et optimisez la gestion avec Skoul.
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={"identifier"}>Identifiant</FieldLabel>
              <Input
                id={"identifier"}
                type={"text"}
                placeholder={"Email ou numéro de téléphone"}
                {...register("identifier")}
                aria-invalid={formState.errors.identifier ? "true" : "false"}
              />
              {formState.errors.identifier && (
                <FieldError>{formState.errors.identifier.message}</FieldError>
              )}
            </Field>
            <PasswordField register={register} formState={formState} />
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        {betterAuthErrors && <FieldError>{betterAuthErrors}</FieldError>}
        <SubmitButton isSubmitting={isSubmitting} type="Se connecter" />
        <Link
          href={"/sign-up"}
          className={
            "underline absolute -bottom-12 right-0 w-fit text-xs text-end hover:opacity-80 opacity-70"
          }
        >
          Vous n&#39;avez pas de compte?
        </Link>
      </FieldGroup>
    </form>
  );
};

export default SignInComponent;
