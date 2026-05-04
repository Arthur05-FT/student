import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { LockKeyhole, MailIcon, MoveRight } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// TODO: Design à implémenter
export default function LoginPage() {
  return (
    <div className="flex flex-col justify-between items-center w-1/3 py-5 px-10">
      <div className="w-full flex justify-between items-center h-fit">
        <div className="flex h-fit gap-2 text-sm">
          <span>Pas encore de compte ?</span>
          <Link
            className="text-emerald-800 underline flex items-center gap-2"
            href="/register"
          >
            S'inscrire <MoveRight />
          </Link>
        </div>
        <div className="flex gap-2 h-fit">
          <span className="underline cursor-pointer">fr</span>
          <Separator className="bg-foreground/50" orientation="vertical" />
          <span className="underline cursor-pointer">en</span>
        </div>
      </div>
      <form action="" className="mb-20 max-w-lg w-full">
        <FieldGroup>
          <FieldSet>
            <h1 className="uppercase text-sm">~ Connectez-vous</h1>
            <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
              Bienvenue chez vous
            </h2>
            <FieldDescription>
              Nommer, editer, simplifier la gestion de vos établissements avec
              Name_.
            </FieldDescription>
          </FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                />
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <div className="flex justify-between">
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-800 underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type="password"
                  placeholder="Entrer votre mot de passe"
                />
                <InputGroupAddon>
                  <LockKeyhole />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="terms-checkbox-2"
                name="terms-checkbox-2"
                defaultChecked
              />
              <FieldContent>
                <FieldLabel htmlFor="terms-checkbox-2">
                  Se souvenir de moi sur cet appareil
                </FieldLabel>
              </FieldContent>
            </Field>
          </FieldGroup>
          <FieldSeparator />
          <FieldGroup>
            <Button size={"lg"}>
              Se connecter
              <MoveRight />
            </Button>
          </FieldGroup>
        </FieldGroup>
      </form>
      <div className="flex w-full justify-between text-xs">
        <span>v3.4.1 · Build 2026.05.12</span>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:underline">
            Aide
          </Link>
          <Link href="/policy" className="hover:underline">
            Mentions légales
          </Link>
        </div>
      </div>
    </div>
  );
}
