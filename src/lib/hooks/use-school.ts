import { useForm } from "react-hook-form";
import { CreateSchoolForm, createSchoolSchema } from "../schemas/school.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { schoolsApi } from "@/lib/api/schools.api";
import { ApiError } from "@/lib/api/client";

export const useCreateSchool = () => {
  const { register, control, handleSubmit, formState } = useForm<CreateSchoolForm>({
    resolver: zodResolver(createSchoolSchema),
    defaultValues: {
      name: "",
      email: "",
      city: "",
      country: "",
      type: "",
    },
  });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<string | null>(null);

  const onSubmit = async (data: CreateSchoolForm) => {
    setServerErrors(null);
    setIsSubmitting(true);
    try {
      const created = await schoolsApi.create(data);
      router.push(`/${created.slug}`);
    } catch (error: unknown) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Une erreur inattendue est survenue.";
      setServerErrors(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    control,
    onSubmit,
    handleSubmit,
    formState,
    isSubmitting,
    serverErrors,
  };
};
