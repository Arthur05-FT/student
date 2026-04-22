import Navbar from "@/components/layout/nav-bar";
import { classesStatistics } from "@/lib/data";

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
        title="Salles de classe"
        basePath={`/${schoolSlug}/classes`}
        description="Gérez les salles de l'établissement — capacités, équipements, affectations et taux d'occupation."
      />
      {children}
    </>
  );
};

export default ClassesLayout;
