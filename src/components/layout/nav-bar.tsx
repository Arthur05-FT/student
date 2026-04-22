"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Route } from "next";

const Navbar = ({
  title,
  basePath,
  description,
}: {
  title: string;
  basePath: string;
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
        <Button
          onClick={() => router.push(`${basePath}/create-classes` as Route)}
          className="flex items-center text-xs"
        >
          <Plus />
          Ajouter classe
          <span className="border -rotate-12 rounded text-xs bg-accent text-foreground px-1 font-semibold">
            N
          </span>
        </Button>
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
