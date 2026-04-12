"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import { Input } from "../ui/input";
import ComboboxComponent from "../shared/combobox.component";
import { cityData, countryData, schoolTypeData } from "@/lib/data";
import SubmitButton from "../shared/submit-button";
import { useCreateSchool } from "@/lib/hooks/use-school";
import Link from "next/link";
import PolicyConfidentialityLinkComponent from "../shared/policy-confidentiality-link.component";

export const CreateSchoolComponent = () => {
  const {
    register,
    control,
    onSubmit,
    handleSubmit,
    formState,
    isSubmitting,
    serverErrors,
  } = useCreateSchool();

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col gap-6 justify-center px-20 bg-muted">
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance">
          Débutez avec Skoul
        </h1>
        <p className="text-xl opacity-70 max-w-2xl">
          Numérisez et simplifiez la gestion de votre établissement en optant
          pour une solution moderne et adaptée à vos besoins...
        </p>
      </div>
      <div className="w-1/3 flex flex-col justify-center items-center px-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md pt-20"
        >
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
                <Input
                  id="name"
                  placeholder="Entrez le nom de l'école"
                  {...register("name")}
                />
                {formState.errors.name && (
                  <FieldError>{formState.errors.name.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email (Optionnel)</FieldLabel>
                <Input
                  id="email"
                  placeholder="Entrez l'email de l'école"
                  {...register("email")}
                />
                {formState.errors.email && (
                  <FieldError>{formState.errors.email.message}</FieldError>
                )}
              </Field>
              <FieldGroup className="grid grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="city">Ville</FieldLabel>
                  <ComboboxComponent
                    name="city"
                    control={control}
                    items={cityData}
                    placeholder="Entrez la ville"
                    errors={formState.errors.city?.message ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="country">Pays</FieldLabel>
                  <ComboboxComponent
                    name="country"
                    control={control}
                    items={countryData}
                    placeholder="Entrez le pays"
                    errors={formState.errors.country?.message ?? ""}
                  />
                </Field>
              </FieldGroup>
              <FieldTitle>Quels type d'école possédez-vous ?</FieldTitle>
              <FieldGroup>
                <ComboboxComponent
                  name="type"
                  control={control}
                  items={schoolTypeData}
                  placeholder="Entrez le type d'école"
                  errors={formState.errors.type?.message ?? ""}
                />
              </FieldGroup>
            </FieldGroup>
            <FieldSeparator />
            {serverErrors && <FieldError>{serverErrors}</FieldError>}
            {serverErrors == "Veuillez vous reconnectez." && (
              <Link href="/sign-in">
                Veuillez vous reconnecter s'il vous plaît.
              </Link>
            )}
            <Field>
              <SubmitButton type={"Continuer..."} isSubmitting={isSubmitting} />
            </Field>
          </FieldGroup>
        </form>
        <PolicyConfidentialityLinkComponent />
      </div>
    </div>
  );
};
