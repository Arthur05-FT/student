import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthTopBar } from "@/components/auth/auth-top-bar";
import { AuthFooter } from "@/components/auth/auth-footer";
import { OtpForm } from "@/components/auth/otp-form";

type Props = {
  searchParams: Promise<{ email?: string; resend?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { email, resend } = await searchParams;

  if (!email) redirect("/register");

  const decodedEmail = decodeURIComponent(email);

  if (resend === "true") {
    try {
      await auth.api.sendVerificationOTP({
        body: { email: decodedEmail, type: "email-verification" },
      });
    } catch {
      // L'OTP existant reste valide — l'utilisateur peut utiliser le bouton "Renvoyer"
    }
  }

  return (
    <div className="flex flex-col justify-between items-center w-1/3 py-5 px-10">
      <AuthTopBar
        hint="Déjà un compte ?"
        linkLabel="Se connecter"
        linkHref="/login"
      />
      <OtpForm email={decodedEmail} />
      <AuthFooter />
    </div>
  );
}
