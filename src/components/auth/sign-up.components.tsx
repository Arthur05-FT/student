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
import { useSignUp } from "@/lib/hooks/useAuth";
import SignButton from "./sign-button";
import PasswordField from "./password-field";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={"max-w-sm mx-auto relative"}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Inscrivez-vous</FieldLegend>
          <FieldDescription>
            Gérez, organisez et optimisez la gestion avec Skoul.
          </FieldDescription>
          <FieldGroup>
            <FieldGroup className="grid max-w-sm grid-cols-2">
              <Field>
                <FieldLabel htmlFor={"firstname"}>Nom</FieldLabel>
                <Input
                  id={"firstname"}
                  type={"text"}
                  placeholder={"Entrez votre nom"}
                  {...register("firstname")}
                  aria-invalid={formState.errors.firstname ? "true" : "false"}
                />
                {formState.errors.firstname && (
                  <FieldError>{formState.errors.firstname.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor={"lastname"}>Prénom</FieldLabel>
                <Input
                  id={"lastname"}
                  type={"text"}
                  placeholder={"Entrez votre prénom"}
                  {...register("lastname")}
                  aria-invalid={formState.errors.lastname ? "true" : "false"}
                />
                {formState.errors.lastname && (
                  <FieldError>{formState.errors.lastname.message}</FieldError>
                )}
              </Field>
            </FieldGroup>
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
        <SignButton isSubmitting={isSubmitting} type="S'inscrire" />
        <Link
          href={"/sign-in"}
          className={
            "underline w-fit absolute -bottom-12 right-0 text-xs hover:opacity-80 opacity-70"
          }
        >
          Vous avez déjà un compte?
        </Link>
      </FieldGroup>
    </form>
  );
};

export default SignUpComponent;
