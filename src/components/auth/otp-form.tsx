"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MoveRight } from "lucide-react";
import { verifyOtpAction, resendOtpAction } from "@/lib/actions/auth-actions";

const INITIAL_STATE = { success: false as const, error: "", fieldErrors: {} };
const RESEND_DELAY = 60;

type Props = { email: string };

export function OtpForm({ email }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    verifyOtpAction,
    INITIAL_STATE,
  );
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(RESEND_DELAY);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (state.success) router.push(state.data.redirectTo as never);
  }, [state, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  async function handleResend() {
    setResending(true);
    await resendOtpAction(email);
    setResending(false);
    setCountdown(RESEND_DELAY);
  }

  return (
    <form action={formAction} className="mb-20 max-w-lg w-full">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="otp" value={otp} />

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="uppercase text-sm">~ Vérification</h1>
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Vérifiez votre email
          </h2>
          <p className="text-sm text-muted-foreground">
            Un code à 6 chiffres a été envoyé à{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
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

          {!state.success && state.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {pending ? (
            <Spinner className="size-6 self-center" />
          ) : (
            <Button size="lg" type="submit" disabled={otp.length < 6}>
              Vérifier <MoveRight />
            </Button>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Vous n'avez pas reçu le code ?</span>
            {countdown > 0 ? (
              <span className="text-emerald-800">
                Renvoyer dans {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-emerald-800 underline disabled:opacity-50"
              >
                {resending ? "Envoi…" : "Renvoyer"}
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
