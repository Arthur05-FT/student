import { notFound, redirect } from "next/navigation";
import ClasseCreateComponent from "@/components/classes/classe-create.component";
import ClassesContent from "@/components/classes/classes-content.component";
import Navbar from "@/components/layout/nav-bar";
import { classesApi } from "@/lib/api/classes.api";
import { teachersApi } from "@/lib/api/teachers.api";
import { ApiError } from "@/lib/api/client";

const ClassesPage = async ({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) => {
  const { schoolSlug } = await params;

  let classes, teachers;
  try {
    [classes, teachers] = await Promise.all([
      classesApi.listServer(schoolSlug),
      teachersApi.listServer(schoolSlug),
    ]);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) redirect("/sign-in");
      if (err.status === 403 || err.status === 404) notFound();
    }
    throw err;
  }

  return (
    <>
      <Navbar
        title="Salles de classe"
        btnText="Ajouter classe"
        formDrawed={<ClasseCreateComponent teachers={teachers} />}
        description="Gérez les salles de l'établissement — capacités, équipements, affectations et taux d'occupation."
      />
      <ClassesContent classes={classes} />
    </>
  );
};

export default ClassesPage;
