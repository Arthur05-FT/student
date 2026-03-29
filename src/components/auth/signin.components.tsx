import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SignInComponent = () => {
  return (
    <form action="" className={"max-w-xs mx-auto relative"}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Connectez-vous</FieldLegend>
          <FieldDescription>
            Gérez, organisez et optimisez la gestion avec Skoul.
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={"identifier"}>Identifiant</FieldLabel>
              <Input
                id={"identifier"}
                type={"text"}
                placeholder={"Email ou numéro de téléphone"}
              />
            </Field>
            <Field>
              <div className={"flex justify-between"}>
                <FieldLabel htmlFor={"password"}>Mot de passe</FieldLabel>
                <Link
                  href={"/"}
                  className={"underline text-xs hover:opacity-80 opacity-70"}
                >
                  Mot de passe oublié?
                </Link>
              </div>
              <Input
                id={"password"}
                type={"password"}
                placeholder={"Mot de passe"}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <Field orientation="horizontal">
          <Button type="submit">Se connecter</Button>
          <Button className={"underline"} variant="link" type="button">
            Retour
          </Button>
        </Field>
        <Link
          href={"/sign-up"}
          className={
            "underline absolute -bottom-12 right-0 w-fit text-xs text-end hover:opacity-80 opacity-70"
          }
        >
          Vous n&#39;avez pas de compte?
        </Link>
      </FieldGroup>
    </form>
  );
};

export default SignInComponent;
