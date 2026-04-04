import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import { Spinner } from "../ui/spinner";

const SignButton = ({
  isSubmitting,
  type,
}: {
  isSubmitting: boolean;
  type: string;
}) => {
  const router = useRouter();

  return (
    <FieldGroup>
      {!isSubmitting ? (
        <Field orientation="horizontal">
          <Button type="submit">{type}</Button>
          <Button
            onClick={() => router.back()}
            className={"underline"}
            variant="link"
            type="button"
          >
            Retour
          </Button>
        </Field>
      ) : (
        <Spinner />
      )}{" "}
    </FieldGroup>
  );
};

export default SignButton;
