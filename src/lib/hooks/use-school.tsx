import { useForm } from "react-hook-form";
import { CreateSchoolForm, createSchoolSchema } from "../schemas/school.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { generateSlug } from "../generate-slug";
import { createSchool } from "@/lib/actions/school.action";

export const useCreateSchool = () => {
  const { register, control, handleSubmit, formState } =
    useForm<CreateSchoolForm>({
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
    try {
      setIsSubmitting(true);
      await createSchool(data);
      router.push(`/schools/${generateSlug(data.name)}`);
    } catch (error: any) {
      setServerErrors(error.message);
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
