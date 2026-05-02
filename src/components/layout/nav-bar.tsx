"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Drawer, DrawerTrigger } from "../ui/drawer";

const Navbar = ({
  title,
  btnText,
  formDrawed,
  description,
}: {
  title: string;
  btnText: string;
  formDrawed: React.ReactNode;
  description: string;
}) => {
  const router = useRouter();

  return (
    <nav>
      <div className="flex justify-between border-b py-1">
        <Button onClick={() => router.back()} variant="ghost">
          <ArrowLeft />
          Retour
        </Button>
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button className="flex items-center text-xs">
              <Plus />
              {btnText}
              <span className="border -rotate-12 rounded text-xs bg-accent text-foreground px-1 font-semibold">
                N
              </span>
            </Button>
          </DrawerTrigger>
          {formDrawed}
        </Drawer>
      </div>
      <div className="p-4 border-b">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight text-balance">
          {title}
        </h1>
        <p className="text-xs opacity-70">{description}</p>
      </div>
    </nav>
  );
};

export default Navbar;
