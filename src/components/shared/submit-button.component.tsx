import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { ReactNode } from "react";

const SubmitButtonComponent = ({
  isSubmitting,
  type,
}: {
  isSubmitting: boolean;
  type: string | ReactNode;
}) => {
  const router = useRouter();

  return (
    <FieldGroup>
      {!isSubmitting ? (
        <Field orientation="horizontal">
          <Button type="submit">{type}</Button>
          {(type == "S'inscrire" || type == "Se connecter") && (
            <Button
              onClick={() => router.back()}
              className={"underline"}
              variant="link"
              type="button"
            >
              Retour
            </Button>
          )}
        </Field>
      ) : (
        <Spinner />
      )}{" "}
    </FieldGroup>
  );
};

export default SubmitButtonComponent;
