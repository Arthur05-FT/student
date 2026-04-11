"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import { Input } from "../ui/input";
import ComboboxComponent from "../shared/combobox-component";
import { city, country, schoolType } from "@/lib/data";
import SubmitButton from "../shared/submit-button";

export const CreateSchoolComponent = () => {
  return (
    <div className="fixed inset-0 backdrop-blur-[2px] z-50 pt-20">
      <form className="w-full max-w-lg mx-auto">
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="font-bold">
              Vos premiers pas avec nous
            </FieldLegend>
            <FieldDescription>
              Faites vos premiers pas avec nous en créant votre première
              institution académique.
            </FieldDescription>
          </FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nom</FieldLabel>
              <Input id="name" placeholder="Entrez le nom de l'école" />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email (Optionnel)</FieldLabel>
              <Input id="email" placeholder="Entrez l'email de l'école" />
            </Field>
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel htmlFor="city">Ville</FieldLabel>
                <ComboboxComponent items={city} placeholder="Entrez la ville" />
              </Field>
              <Field>
                <FieldLabel htmlFor="country">Pays</FieldLabel>
                <ComboboxComponent
                  items={country}
                  placeholder="Entrez le pays"
                />
              </Field>
            </FieldGroup>
            <FieldTitle>Quels type d'école possédez-vous ?</FieldTitle>
            <FieldGroup>
              <ComboboxComponent
                items={schoolType}
                placeholder="Entrez le type d'école"
              />
            </FieldGroup>
          </FieldGroup>
          <FieldSeparator />
          <Field>
            <SubmitButton type={"Continuer"} isSubmitting={false} />
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};
