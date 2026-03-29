import { useForm } from "react-hook-form";
import { SignUpForm, signUpSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { signUp } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { generateUsername } from "unique-username-generator";
import { number } from "zod";

export const useSignUp = () => {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | undefined>(undefined);
  const clearGlobalError = useCallback(() => setGlobalError(undefined), []);
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      phone: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    async (data: SignUpForm) => {
      setGlobalError(undefined);
      form.clearErrors("root");

      try {
        const { error } = await signUp.email({
          email: data.email,
          name: data.firstname + " " + data.lastname,
          password: data.password,
          username:
            generateUsername("-", 2, 10, data.lastname.trim().toLowerCase()) +
            Math.floor(Math.random() * 1000),
          phone: data.phone,
        } as any);

        if (error) {
          setGlobalError(error.message);
          console.log(globalError);
          form.setError("root", { type: "manual", message: error.message });
          return;
        }
        form.reset();
        router.push("/sign-in");
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Une erreur est survenue lors de l'inscription";
        setGlobalError(message);
        form.setError("root", { type: "manual", message });
      }
    },
    [form],
  );

  return {
    form,
    onSubmit,
    globalError,
    clearGlobalError,
    isSubmitting: form.formState.isSubmitting,
  };
};

export const useSignIn = () => {};
