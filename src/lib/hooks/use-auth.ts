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
import { signInService, signUpService } from "../services/auth.service";

export const useSignUp = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [betterAuthErrors, setBetterAuthErrors] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpForm) => {
    setBetterAuthErrors(null);
    await signUpService(data, setBetterAuthErrors, router, setIsSubmitting);
  };

  return {
    register,
    handleSubmit,
    formState,
    onSubmit,
    betterAuthErrors,
    isSubmitting,
  };
};

export const useSignIn = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [betterAuthErrors, setBetterAuthErrors] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInForm) => {
    setBetterAuthErrors(null);
    await signInService(data, setBetterAuthErrors, router, setIsSubmitting);
  };

  return {
    register,
    handleSubmit,
    formState,
    onSubmit,
    betterAuthErrors,
    isSubmitting,
  };
};
