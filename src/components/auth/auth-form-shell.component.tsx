import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import Link from "next/link";
import SubmitButtonComponent from "../shared/submit-button.component";
import PolicyConfidentialityLinkComponent from "../shared/policy-confidentiality-link.component";

type Props = {
  title: string;
  description: string;
  submitLabel: string;
  isSubmitting: boolean;
  serverError?: string | null;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  footerLink: { href: string; label: string };
  children: React.ReactNode;
};

const AuthFormShell = ({
  title,
  description,
  submitLabel,
  isSubmitting,
  serverError,
  onSubmit,
  footerLink,
  children,
}: Props) => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center px-10">
      <form onSubmit={onSubmit} className="w-full max-w-sm pt-20 relative">
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="font-bold">{title}</FieldLegend>
            <FieldDescription>{description}</FieldDescription>
            <FieldGroup>{children}</FieldGroup>
          </FieldSet>
          <FieldSeparator />
          {serverError && <FieldError>{serverError}</FieldError>}
          <SubmitButtonComponent isSubmitting={isSubmitting} type={submitLabel} />
          <Link
            href={footerLink.href}
            className="underline absolute -bottom-12 right-0 w-fit text-xs text-end hover:opacity-80 opacity-70"
          >
            {footerLink.label}
          </Link>
        </FieldGroup>
      </form>
      <PolicyConfidentialityLinkComponent />
    </div>
  );
};

export default AuthFormShell;
