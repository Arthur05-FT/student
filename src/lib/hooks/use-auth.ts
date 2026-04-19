import { useForm } from "react-hook-form";
import {
  SignInForm,
  signInSchema,
  SignUpForm,
  signUpSchema,
} from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInService,
  signOutService,
  signUpService,
} from "../services/auth.service";

export const useSignUp = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [betterAuthErrors, setBetterAuthErrors] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { firstname: "", lastname: "", identifier: "", password: "" },
  });

  const onSubmit = async (data: SignUpForm) => {
    setBetterAuthErrors(null);
    setIsSubmitting(true);
    const result = await signUpService(data);
    setIsSubmitting(false);
    if (result.ok) router.push("/sign-in");
    else setBetterAuthErrors(result.error);
  };

  return { register, handleSubmit, formState, onSubmit, betterAuthErrors, isSubmitting };
};

export const useSignIn = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [betterAuthErrors, setBetterAuthErrors] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: SignInForm) => {
    setBetterAuthErrors(null);
    setIsSubmitting(true);
    const result = await signInService(data);
    setIsSubmitting(false);
    if (result.ok) router.push("/");
    else setBetterAuthErrors(result.error);
  };

  return { register, handleSubmit, formState, onSubmit, betterAuthErrors, isSubmitting };
};

export const useSignOut = () => {
  const router = useRouter();
  return async () => {
    await signOutService();
    router.push("/sign-in");
  };
};
