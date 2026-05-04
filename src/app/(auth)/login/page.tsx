import { AuthTopBar } from "@/components/auth/auth-top-bar";
import { AuthFooter } from "@/components/auth/auth-footer";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-between items-center w-1/3 py-5 px-10">
      <AuthTopBar
        hint="Pas encore de compte ?"
        linkLabel="S'inscrire"
        linkHref="/register"
      />
      <LoginForm />
      <AuthFooter />
    </div>
  );
}
