import { MoveRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Props = {
  hint: string;
  linkLabel: string;
  linkHref: string;
};

export function AuthTopBar({ hint, linkLabel, linkHref }: Props) {
  return (
    <div className="w-full flex justify-between items-center h-fit">
      <div className="flex h-fit gap-2 text-sm">
        <span>{hint}</span>
        <a
          className="text-emerald-800 underline flex items-center gap-2"
          href={linkHref}
        >
          {linkLabel} <MoveRight />
        </a>
      </div>
      <div className="flex gap-2 h-fit">
        <span className="underline cursor-pointer">fr</span>
        <Separator className="bg-foreground/50" orientation="vertical" />
        <span className="underline cursor-pointer">en</span>
      </div>
    </div>
  );
}
