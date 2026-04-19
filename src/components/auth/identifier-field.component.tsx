import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
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

const IdentifierField = <T extends FieldValues>({
  register,
  formState,
  name = "identifier" as Path<T>,
}: Props<T>) => {
  const error = formState.errors[name];
  return (
    <Field>
      <FieldLabel htmlFor="identifier">Identifiant</FieldLabel>
      <Input
        id="identifier"
        type="text"
        placeholder="Email ou numéro de téléphone"
        {...register(name)}
        aria-invalid={error ? "true" : "false"}
      />
      {error && <FieldError>{String(error.message)}</FieldError>}
    </Field>
  );
};

export default IdentifierField;
