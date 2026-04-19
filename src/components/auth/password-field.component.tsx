import { Eye, EyeClosed } from "lucide-react";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Button } from "../ui/button";
import React from "react";
import type {
  FieldValues,
  Path,
  UseFormRegister,
  FormState,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  formState: FormState<T>;
  name?: Path<T>;
};

const PasswordField = <T extends FieldValues>({
  register,
  formState,
  name = "password" as Path<T>,
}: Props<T>) => {
  const [hide, setHide] = React.useState(false);
  const error = formState.errors[name];

  return (
    <Field>
      <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
      <Field>
        <InputGroup>
          <InputGroupInput
            id="password"
            type={hide ? "text" : "password"}
            placeholder="Entrez votre mot de passe"
            {...register(name)}
            aria-invalid={error ? "true" : "false"}
          />
          <InputGroupAddon align="inline-end">
            <Button
              type="button"
              className="bg-transparent outline-0 text-black hover:bg-transparent"
              onClick={() => setHide(!hide)}
              aria-label={hide ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {hide ? <Eye /> : <EyeClosed />}
            </Button>
          </InputGroupAddon>
        </InputGroup>
        {error && <FieldError>{String(error.message)}</FieldError>}
      </Field>
    </Field>
  );
};

export default PasswordField;
