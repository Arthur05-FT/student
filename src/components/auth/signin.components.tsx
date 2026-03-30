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
import { Button } from "@/components/ui/button";
import { useSignIn } from "@/hooks/useAuth";
import { Spinner } from "../ui/spinner";

const SignInComponent = () => {
  const { form, onSubmit, globalError } = useSignIn();

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={"max-w-xs mx-auto relative"}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Connectez-vous</FieldLegend>
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
                {...form.register("identifier")}
              />
            </Field>
            {form.formState.errors.identifier && (
              <FieldError>
                {form.formState.errors.identifier.message}
              </FieldError>
            )}
            <Field>
              <div className={"flex justify-between"}>
                <FieldLabel htmlFor={"password"}>Mot de passe</FieldLabel>
                <Link
                  href={"/"}
                  className={"underline text-xs hover:opacity-80 opacity-70"}
                >
                  Mot de passe oublié?
                </Link>
              </div>
              <Input
                id={"password"}
                type={"password"}
                placeholder={"Mot de passe"}
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <FieldError>
                  {form.formState.errors.password.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldGroup>
          {globalError && <FieldError>{globalError}</FieldError>}
          {!form.formState.isSubmitting ? (
            <Field orientation="horizontal">
              <Button type="submit">Se connecter</Button>
              <Button className={"underline"} variant="link" type="button">
                Retour
              </Button>
            </Field>
          ) : (
            <Spinner />
          )}
        </FieldGroup>
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
