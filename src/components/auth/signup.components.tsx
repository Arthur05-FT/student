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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
import React from "react";
import { useSignUp } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

const SignupComponent = () => {
  const { form, onSubmit, globalError, isSubmitting } = useSignUp();
  const [hide, setHide] = React.useState(false);
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={"max-w-sm mx-auto relative"}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Inscrivez-vous</FieldLegend>
          <FieldDescription>
            Gérez, organisez et optimisez la gestion avec Skoul.
          </FieldDescription>
          <FieldGroup>
            <Field orientation={"horizontal"}>
              <Field>
                <FieldLabel htmlFor={"firstname"}>Nom</FieldLabel>
                <Field>
                  <Input
                    id={"firstname"}
                    type={"text"}
                    placeholder={"Entrez votre nom"}
                    {...form.register("firstname")}
                  />
                  {form.formState.errors.firstname && (
                    <FieldError>
                      {form.formState.errors.firstname.message}
                    </FieldError>
                  )}
                </Field>
              </Field>
              <Field>
                <FieldLabel htmlFor={"lastname"}>Prénom</FieldLabel>
                <Field>
                  <Input
                    id={"lastname"}
                    type={"text"}
                    placeholder={"Entrez votre prénom"}
                    {...form.register("lastname")}
                  />
                  {form.formState.errors.lastname && (
                    <FieldError>
                      {form.formState.errors.lastname.message}
                    </FieldError>
                  )}
                </Field>
              </Field>
            </Field>
            <Field>
              <FieldLabel htmlFor={"email"}>Email</FieldLabel>
              <Input
                id={"email"}
                type={"text"}
                placeholder={"Entrez votre email"}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <FieldError>{form.formState.errors.email.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor={"email"}>Numéro de téléphone</FieldLabel>
              <Input
                id={"phone"}
                type={"text"}
                placeholder={"Entrez votre numéro de téléphone"}
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <FieldError>{form.formState.errors.phone.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor={"password"}>Mot de passe</FieldLabel>
              <Field>
                <InputGroup>
                  <InputGroupInput
                    id={"password"}
                    type={hide ? "password" : "text"}
                    placeholder={"Mot de passe"}
                    {...form.register("password")}
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type={"button"}
                      className={
                        "bg-transparent outline-0 text-black hover:bg-transparent"
                      }
                      onClick={() => setHide(!hide)}
                    >
                      {hide ? <EyeClosed /> : <Eye />}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                {form.formState.errors.password && (
                  <FieldError>
                    {form.formState.errors.password.message}
                  </FieldError>
                )}
              </Field>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldGroup>
          {(globalError || form.formState.errors.root?.message) && (
            <FieldError>
              {globalError || form.formState.errors.root?.message}
            </FieldError>
          )}
          {!isSubmitting ? (
            <Field orientation="horizontal">
              <Button type="submit">S'inscrire</Button>
              <Button className={"underline"} variant="link" type="button">
                Retour
              </Button>
            </Field>
          ) : (
            <Spinner />
          )}
        </FieldGroup>
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

export default SignupComponent;
