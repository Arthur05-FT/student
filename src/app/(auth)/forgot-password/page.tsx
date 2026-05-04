import { AuthTopBar } from "@/components/auth/auth-top-bar";
import { AuthFooter } from "@/components/auth/auth-footer";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col justify-between items-center w-1/3 py-5 px-10">
      <AuthTopBar
        hint="Vous souvenez du mot de passe ?"
        linkLabel="Se connecter"
        linkHref="/login"
      />
      <ForgotPasswordForm />
      <AuthFooter />
    </div>
  );
}
