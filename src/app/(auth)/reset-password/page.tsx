import { redirect } from "next/navigation";
import { AuthTopBar } from "@/components/auth/auth-top-bar";
import { AuthFooter } from "@/components/auth/auth-footer";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { email } = await searchParams;

  if (!email) redirect("/forgot-password");

  const decodedEmail = decodeURIComponent(email);

  return (
    <div className="flex flex-col justify-between items-center w-1/3 py-5 px-10">
      <AuthTopBar
        hint="Vous souvenez du mot de passe ?"
        linkLabel="Se connecter"
        linkHref="/login"
      />
      <ResetPasswordForm email={decodedEmail} />
      <AuthFooter />
    </div>
  );
}
