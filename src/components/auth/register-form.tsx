"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldDescription,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  MailIcon,
  LockKeyhole,
  UserIcon,
  MoveRight,
  PhoneIcon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { registerAction } from "@/lib/actions/auth-actions";

const INITIAL_STATE = { success: false as const, error: "", fieldErrors: {} };

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    registerAction,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.success) router.push(state.data.redirectTo as never);
  }, [state, router]);

  const fieldError = (key: string) =>
    !state.success ? state.fieldErrors?.[key]?.[0] : undefined;

  return (
    <form action={formAction} className="mb-20 max-w-100 w-full">
      <FieldGroup>
        <FieldSet>
          <h1 className="uppercase text-sm">~ Créer un compte</h1>
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Commençons
          </h2>
          <FieldDescription>
            Rejoignez Name_ et gérez vos établissements en toute simplicité.
          </FieldDescription>
        </FieldSet>

        <FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="firstName"
                  name="firstName"
                  placeholder="Jean"
                />
                <InputGroupAddon>
                  <UserIcon />
                </InputGroupAddon>
              </InputGroup>
              {fieldError("firstName") && (
                <p className="text-xs text-red-500">
                  {fieldError("firstName")}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Nom</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="lastName"
                  name="lastName"
                  placeholder="Dupont"
                />
                <InputGroupAddon>
                  <UserIcon />
                </InputGroupAddon>
              </InputGroup>
              {fieldError("lastName") && (
                <p className="text-xs text-red-500">{fieldError("lastName")}</p>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="phone"
                name="phone"
                type="tel"
                placeholder="+237 6xx xxx xxx"
              />
              <InputGroupAddon>
                <PhoneIcon />
              </InputGroupAddon>
            </InputGroup>
            {fieldError("phone") && (
              <p className="text-xs text-red-500">{fieldError("phone")}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="email"
                name="email"
                type="email"
                placeholder="vous@exemple.cm"
              />
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
            </InputGroup>
            {fieldError("email") && (
              <p className="text-xs text-red-500">{fieldError("email")}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="password"
                name="password"
                type="password"
                placeholder="8 caractères minimum"
              />
              <InputGroupAddon>
                <LockKeyhole />
              </InputGroupAddon>
            </InputGroup>
            {fieldError("password") && (
              <p className="text-xs text-red-500">{fieldError("password")}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">
              Confirmer le mot de passe
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Répétez le mot de passe"
              />
              <InputGroupAddon>
                <LockKeyhole />
              </InputGroupAddon>
            </InputGroup>
            {fieldError("confirmPassword") && (
              <p className="text-xs text-red-500">
                {fieldError("confirmPassword")}
              </p>
            )}
          </Field>

          {!state.success && state.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
        </FieldGroup>

        <FieldSeparator />

        <FieldGroup>
          {pending ? (
            <Spinner className="size-6 self-center" />
          ) : (
            <Button size="lg" type="submit">
              Créer mon compte <MoveRight />
            </Button>
          )}
        </FieldGroup>
      </FieldGroup>
    </form>
  );
}
