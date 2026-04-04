import { Eye, EyeClosed } from "lucide-react";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Button } from "../ui/button";
import React from "react";

const PasswordField = ({
  register,
  formState,
}: {
  register: any;
  formState: any;
}) => {
  const [hide, setHide] = React.useState(false);
  return (
    <Field>
      <FieldLabel htmlFor={"password"}>Mot de passe</FieldLabel>
      <Field>
        <InputGroup>
          <InputGroupInput
            id={"password"}
            type={!hide ? "password" : "text"}
            placeholder={"Entrez votre mot de passe"}
            {...register("password")}
            aria-invalid={formState.errors.password ? "true" : "false"}
          />
          <InputGroupAddon align="inline-end">
            <Button
              type={"button"}
              className={
                "bg-transparent outline-0 text-black hover:bg-transparent"
              }
              onClick={() => setHide(!hide)}
            >
              {!hide ? <EyeClosed /> : <Eye />}
            </Button>
          </InputGroupAddon>
        </InputGroup>
        {formState.errors.password && (
          <FieldError>{formState.errors.password.message}</FieldError>
        )}
      </Field>
    </Field>
  );
};

export default PasswordField;
