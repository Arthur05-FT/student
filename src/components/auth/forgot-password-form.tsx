"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MailIcon, MoveRight } from "lucide-react";
import { forgotPasswordAction } from "@/lib/actions/auth-actions";

const INITIAL_STATE = { success: false as const, error: "", fieldErrors: {} };

export function ForgotPasswordForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(forgotPasswordAction, INITIAL_STATE);

  useEffect(() => {
    if (state.success) router.push(state.data.redirectTo as never);
  }, [state, router]);

  return (
    <form action={formAction} className="mb-20 max-w-100 w-full">
      <FieldGroup>
        <FieldSet>
          <h1 className="uppercase text-sm">~ Mot de passe oublié</h1>
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Réinitialiser
          </h2>
          <FieldDescription>
            Entrez votre email pour recevoir un code de réinitialisation.
          </FieldDescription>
        </FieldSet>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup>
              <InputGroupInput id="email" name="email" type="email" placeholder="vous@exemple.cm" />
              <InputGroupAddon><MailIcon /></InputGroupAddon>
            </InputGroup>
            {!state.success && state.fieldErrors?.email?.[0] && (
              <p className="text-xs text-red-500">{state.fieldErrors.email[0]}</p>
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
              Envoyer le code <MoveRight />
            </Button>
          )}
        </FieldGroup>
      </FieldGroup>
    </form>
  );
}
