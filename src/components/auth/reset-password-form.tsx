"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { LockIcon, MoveRight } from "lucide-react";
import { resetPasswordAction } from "@/lib/actions/auth-actions";

const INITIAL_STATE = { success: false as const, error: "", fieldErrors: {} };

type Props = { email: string };

export function ResetPasswordForm({ email }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(resetPasswordAction, INITIAL_STATE);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (state.success) router.push(state.data.redirectTo as never);
  }, [state, router]);

  return (
    <form action={formAction} className="mb-20 max-w-100 w-full">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="otp" value={otp} />

      <FieldGroup>
        <FieldSet>
          <h1 className="uppercase text-sm">~ Nouveau mot de passe</h1>
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Réinitialiser
          </h2>
          <FieldDescription>
            Entrez le code reçu par email puis choisissez votre nouveau mot de passe.
          </FieldDescription>
        </FieldSet>

        <FieldGroup>
          <Field>
            <FieldLabel>Code de vérification</FieldLabel>
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={setOtp}
              containerClassName="w-full"
            >
              <InputOTPGroup className="flex-1">
                <InputOTPSlot index={0} className="flex-1 h-14 w-auto text-xl" />
                <InputOTPSlot index={1} className="flex-1 h-14 w-auto text-xl" />
                <InputOTPSlot index={2} className="flex-1 h-14 w-auto text-xl" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="flex-1">
                <InputOTPSlot index={3} className="flex-1 h-14 w-auto text-xl" />
                <InputOTPSlot index={4} className="flex-1 h-14 w-auto text-xl" />
                <InputOTPSlot index={5} className="flex-1 h-14 w-auto text-xl" />
              </InputOTPGroup>
            </InputOTP>
            {!state.success && state.fieldErrors?.otp?.[0] && (
              <p className="text-xs text-red-500">{state.fieldErrors.otp[0]}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Nouveau mot de passe</FieldLabel>
            <InputGroup>
              <InputGroupInput id="password" name="password" type="password" placeholder="••••••••" />
              <InputGroupAddon><LockIcon /></InputGroupAddon>
            </InputGroup>
            {!state.success && state.fieldErrors?.password?.[0] && (
              <p className="text-xs text-red-500">{state.fieldErrors.password[0]}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
            <InputGroup>
              <InputGroupInput id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" />
              <InputGroupAddon><LockIcon /></InputGroupAddon>
            </InputGroup>
            {!state.success && state.fieldErrors?.confirmPassword?.[0] && (
              <p className="text-xs text-red-500">{state.fieldErrors.confirmPassword[0]}</p>
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
            <Button size="lg" type="submit" disabled={otp.length < 6}>
              Confirmer <MoveRight />
            </Button>
          )}
        </FieldGroup>
      </FieldGroup>
    </form>
  );
}
