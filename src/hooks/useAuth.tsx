"use client";

import { useForm } from "react-hook-form";
import {
  SignInForm,
  signInSchema,
  SignUpForm,
  signUpSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signUp } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { generateUsername } from "unique-username-generator";
import { signInAction } from "@/actions/auth.actions";

export const useSignUp = () => {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | undefined>(undefined);

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

  const onSubmit = async (data: SignUpForm) => {
    setGlobalError(undefined);
    form.clearErrors("root");

    const { error } = await signUp.email({
      email: data.email,
      name: `${data.firstname} ${data.lastname}`,
      password: data.password,
      phone: data.phone,
      username:
        generateUsername("-", 2, 10, data.lastname.trim().toLowerCase()) +
        Math.floor(Math.random() * 1000),
    } as any);

    if (error) {
      setGlobalError(error.message);
      form.setError("root", { type: "manual", message: error.message });
      return;
    }

    form.reset();
    router.push("/sign-in");
  };

  return {
    form,
    onSubmit,
    globalError,
  };
};

export const useSignIn = () => {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | undefined>(undefined);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: SignInForm) => {
    setGlobalError(undefined);
    const { error } = await signInAction(data.identifier, data.password);

    if (error) {
      setGlobalError(error);
      form.setError("root", { type: "manual", message: error });
      return;
    }

    router.push("/dashboard");
  };

  return {
    form,
    onSubmit,
    globalError,
  };
};
