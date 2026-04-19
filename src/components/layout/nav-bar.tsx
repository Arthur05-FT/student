"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";

const Navbar = ({
  title,
  basePath,
  navbarData,
}: {
  title: string;
  basePath: string;
  navbarData: { name: string; link: string }[];
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav>
      <div className="flex justify-between border-b py-1">
        <Button onClick={() => router.back()} variant="ghost">
          <ArrowLeft />
          Retour
        </Button>
        <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight text-balance">
          {title}
        </h1>
      </div>
      <Tabs value={pathname}>
        <TabsList variant="line">
          {navbarData.map((item) => {
            const href = `${basePath}${item.link}`;
            return (
              <TabsTrigger key={href} value={href} asChild>
                <Link href={href}>{item.name}</Link>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </nav>
  );
};

export default Navbar;
