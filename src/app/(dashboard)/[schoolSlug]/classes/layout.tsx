import Navbar from "@/components/layout/nav-bar";
import { classNavbarData } from "@/lib/data";

const ClassesLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ schoolSlug: string }>;
}) => {
  const { schoolSlug } = await params;

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
