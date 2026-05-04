import { AuthTopBar } from "@/components/auth/auth-top-bar";
import { AuthFooter } from "@/components/auth/auth-footer";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-col justify-between items-center w-1/3 py-5 px-10">
      <AuthTopBar
        hint="Déjà un compte ?"
        linkLabel="Se connecter"
        linkHref="/login"
      />
      <RegisterForm />
      <AuthFooter />
    </div>
  );
}
