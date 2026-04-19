// app/[schoolSlug]/classes/layout.tsx
import { use } from "react";
import Navbar from "@/components/layout/nav-bar";
import { classNavbarData } from "@/lib/data";

const ClassesLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ schoolSlug: string }>;
}) => {
  const { schoolSlug } = use(params); // ← use() au lieu de await

  return (
    <>
      <Navbar
        title="Classes."
        basePath={`/${schoolSlug}/classes`}
        navbarData={classNavbarData}
      />
      {children}
    </>
  );
};

export default ClassesLayout;
