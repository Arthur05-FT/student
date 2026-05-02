"use client";

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
import { useUpdateClasse } from "@/lib/hooks/use-classe";
import { levelData } from "@/lib/data";
import { capitalize } from "@/lib/utils";
import type { ClassesListItem, TeacherItem } from "@/lib/api/types";

const levelItems = levelData.map(capitalize);

const ClasseEditComponent = ({
  classe,
  teachers,
  onSuccess,
}: {
  classe: ClassesListItem;
  teachers: TeacherItem[];
  onSuccess: (updated: ClassesListItem) => void;
}) => {
  const { register, control, handleSubmit, formState, onSubmit, serverError, reset, teacherItems } =
    useUpdateClasse(classe, teachers, onSuccess);

  return (
    <DrawerWrapper
      title="Modifier la classe"
      description="Modifiez les informations de cette classe."
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
                <Input id="room" placeholder="ex: salle 12" {...register("room")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="capacity">Capacité (optionnel)</FieldLabel>
                <Input id="capacity" placeholder="ex: 30" {...register("capacity")} />
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel htmlFor="building">Bâtiment (optionnel)</FieldLabel>
              <Input id="building" placeholder="ex: bâtiment a" {...register("building")} />
            </Field>
          </FieldSet>
        </FieldGroup>

        {serverError && <FieldError>{serverError}</FieldError>}

        <div className="flex gap-2">
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? <Spinner /> : "Enregistrer"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" type="button" onClick={() => reset()}>Annuler</Button>
          </DrawerClose>
        </div>
      </form>
    </DrawerWrapper>
  );
};

export default ClasseEditComponent;
