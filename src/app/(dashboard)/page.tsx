// (dashboard)/page.tsx
import { findSchoolByEmailUserName } from "@/lib/actions/school.action";
import { CreateSchoolComponent } from "@/components/schools/create-school.component";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateSlug } from "@/lib/generate-slug";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const result = await findSchoolByEmailUserName(session?.user.email!);

  if (result?.schoolName) {
    redirect(`/${generateSlug(result.schoolName)}`);
  }

  return <CreateSchoolComponent />;
};

export default DashboardPage;
