import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { classeSchema, type ClasseForm } from "@/lib/schemas/classe.schema";
import { classesApi } from "@/lib/api/classes.api";
import { ApiError } from "@/lib/api/client";
import { useCurrentSchool } from "@/lib/contexts/school-context";
import { capitalize } from "@/lib/utils";
import type { ClassesListItem, TeacherItem } from "@/lib/api/types";

const buildTeacherItems = (teachers: TeacherItem[]) =>
  teachers.map((t) => ({
    id: t.id,
    label: `${capitalize(t.firstname)} ${capitalize(t.lastname)}`,
  }));

const resolvePayload = (
  data: ClasseForm,
  teacherItems: { id: string; label: string }[],
) => ({
  name: data.name,
  level: data.level,
  headTeacherId: teacherItems.find((t) => t.label === data.headTeacherLabel)?.id,
  capacity: data.capacity || undefined,
  room: data.room || undefined,
  building: data.building || undefined,
});

export const useCreateClasse = (teachers: TeacherItem[]) => {
  const school = useCurrentSchool();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const teacherItems = useMemo(() => buildTeacherItems(teachers), [teachers]);

  const { register, control, handleSubmit, formState, reset } =
    useForm<ClasseForm>({
      resolver: zodResolver(classeSchema),
      defaultValues: {
        name: "",
        level: "",
        headTeacherLabel: "",
        capacity: "",
        room: "",
        building: "",
      },
    });

  const onSubmit = async (data: ClasseForm) => {
    setServerError(null);
    try {
      await classesApi.create(school.slug, resolvePayload(data, teacherItems));
      reset();
      router.refresh();
    } catch (err) {
      setServerError(
        err instanceof ApiError ? err.message : "Une erreur inattendue est survenue.",
      );
    }
  };

  return { register, control, handleSubmit, formState, onSubmit, serverError, teacherItems };
};

export const useUpdateClasse = (
  classe: ClassesListItem,
  teachers: TeacherItem[],
  onSuccess: (updated: ClassesListItem) => void,
) => {
  const school = useCurrentSchool();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const teacherItems = useMemo(() => buildTeacherItems(teachers), [teachers]);

  const existingTeacherLabel = classe.headTeacher
    ? `${capitalize(classe.headTeacher.firstname)} ${capitalize(classe.headTeacher.lastname)}`
    : "";

  const { register, control, handleSubmit, formState, reset } =
    useForm<ClasseForm>({
      resolver: zodResolver(classeSchema),
      defaultValues: {
        name: classe.name,
        level: classe.level ? capitalize(classe.level) : "",
        headTeacherLabel: existingTeacherLabel,
        capacity: classe.capacity ?? "",
        room: classe.room ?? "",
        building: classe.building ?? "",
      },
    });

  const onSubmit = async (data: ClasseForm) => {
    setServerError(null);
    try {
      const updated = await classesApi.update(school.slug, classe.id, {
        ...resolvePayload(data, teacherItems),
        headTeacherId:
          teacherItems.find((t) => t.label === data.headTeacherLabel)?.id ?? null,
      });
      router.refresh();
      onSuccess(updated);
    } catch (err) {
      setServerError(
        err instanceof ApiError ? err.message : "Une erreur inattendue est survenue.",
      );
    }
  };

  return { register, control, handleSubmit, formState, onSubmit, serverError, reset, teacherItems };
};
