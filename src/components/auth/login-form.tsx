"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MailIcon, LockKeyhole, MoveRight, ShieldAlert } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { loginAction } from "@/lib/actions/auth-actions";

function UnverifiedEmailNotice({ email }: { email: string }) {
  const href = `/verify-email?email=${encodeURIComponent(email)}&resend=true`;
  return (
    <div className="p-2">
      <a
        href={href}
        className="self-start text-sm font-medium text-amber-700 underline underline-offset-4"
      >
        Vous devez vérifier votre adresse email →
      </a>
    </div>
  );
}

const INITIAL_STATE = { success: false as const, error: "", fieldErrors: {} };

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    loginAction,
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
          <h1 className="uppercase text-sm">~ Connectez-vous</h1>
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Bienvenue
          </h2>
          <FieldDescription>
            Nommer, editer, simplifier la gestion de vos établissements avec
            Name_.
          </FieldDescription>
        </FieldSet>

        <FieldGroup>
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
            <div className="flex justify-between">
              <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-sm text-emerald-800 underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
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

          <Field orientation="horizontal">
            <Checkbox id="remember" name="remember" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="remember">Se souvenir de moi</FieldLabel>
            </FieldContent>
          </Field>

          {!state.success && state.meta?.unverifiedEmail ? (
            <UnverifiedEmailNotice email={state.meta.unverifiedEmail} />
          ) : (
            !state.success &&
            state.error && <p className="text-sm text-red-500">{state.error}</p>
          )}
        </FieldGroup>

        <FieldSeparator />

        <FieldGroup>
          {pending ? (
            <Spinner className="size-6 self-center" />
          ) : (
            <Button size="lg" type="submit">
              Se connecter <MoveRight />
            </Button>
          )}
        </FieldGroup>
      </FieldGroup>
    </form>
  );
}
