"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import DrawerWrapper from "../layout/drawer-wrapper";
import { DrawerClose } from "../ui/drawer";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import ComboboxComponent from "../shared/combobox.component";
import { classesApi } from "@/lib/api/classes.api";
import { ApiError } from "@/lib/api/client";
import { useCurrentSchool } from "@/lib/contexts/school-context";
import { levelData } from "@/lib/data";
import { capitalize } from "@/lib/utils";
import type { TeacherItem } from "@/lib/api/types";

const createClasseSchema = z.object({
  name: z.string().min(1, { message: "Nom requis" }).max(80),
  level: z.string().min(1, { message: "Niveau requis" }).max(50),
  headTeacherLabel: z.string().optional(),
  capacity: z.string().max(10).optional(),
  room: z.string().max(50).optional(),
  building: z.string().max(50).optional(),
});

type CreateClasseForm = z.infer<typeof createClasseSchema>;

const levelItems = levelData.map(capitalize);

const ClasseCreateComponent = ({ teachers }: { teachers: TeacherItem[] }) => {
  const school = useCurrentSchool();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const teacherItems = teachers.map((t) => ({
    id: t.id,
    label: `${capitalize(t.firstname)} ${capitalize(t.lastname)}`,
  }));

  const { register, control, handleSubmit, formState, reset } =
    useForm<CreateClasseForm>({
      resolver: zodResolver(createClasseSchema),
      defaultValues: {
        name: "",
        level: "",
        headTeacherLabel: "",
        capacity: "",
        room: "",
        building: "",
      },
    });

  const onSubmit = async (data: CreateClasseForm) => {
    setServerError(null);
    try {
      const headTeacher = teacherItems.find(
        (t) => t.label === data.headTeacherLabel,
      );
      await classesApi.create(school.slug, {
        name: data.name,
        level: data.level,
        headTeacherId: headTeacher?.id,
        capacity: data.capacity || undefined,
        room: data.room || undefined,
        building: data.building || undefined,
      });
      reset();
      router.refresh();
    } catch (err) {
      setServerError(
        err instanceof ApiError
          ? err.message
          : "Une erreur inattendue est survenue.",
      );
    }
  };

  return (
    <DrawerWrapper
      title="Ajouter une classe"
      description="Créez une nouvelle classe pour votre établissement."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 overflow-y-auto"
      >
        <FieldGroup>
          <FieldSet>
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel>Niveau</FieldLabel>
                <ComboboxComponent
                  name="level"
                  control={control}
                  items={levelItems}
                  placeholder="ex: Terminale"
                  errors={formState.errors.level?.message ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="name">Classe</FieldLabel>
                <Input id="name" placeholder="ex: a" {...register("name")} />
                {formState.errors.name && (
                  <FieldError>{formState.errors.name.message}</FieldError>
                )}
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel>Professeur principal (optionnel)</FieldLabel>
              <ComboboxComponent
                name="headTeacherLabel"
                control={control}
                items={teacherItems.map((t) => t.label)}
                placeholder="Rechercher un professeur..."
              />
            </Field>

            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel htmlFor="room">Salle (optionnel)</FieldLabel>
                <Input
                  id="room"
                  placeholder="ex: salle 12"
                  {...register("room")}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="capacity">Capacité (optionnel)</FieldLabel>
                <Input
                  id="capacity"
                  placeholder="ex: 30"
                  {...register("capacity")}
                />
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel htmlFor="building">Bâtiment (optionnel)</FieldLabel>
              <Input
                id="building"
                placeholder="ex: bâtiment a"
                {...register("building")}
              />
            </Field>
          </FieldSet>
        </FieldGroup>

        {serverError && <FieldError>{serverError}</FieldError>}

        <div className="flex gap-2">
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? <Spinner /> : "Ajouter"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" type="button">
              Annuler
            </Button>
          </DrawerClose>
        </div>
      </form>
    </DrawerWrapper>
  );
};

export default ClasseCreateComponent;
