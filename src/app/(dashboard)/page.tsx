import { findSchoolByEmailUserName } from "@/lib/actions/school.action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.email) redirect("/sign-in");

  const result = await findSchoolByEmailUserName(session.user.email);

  if (result.schoolSlug) redirect(`/${result.schoolSlug}`);

  redirect("/create-school");
};

export default DashboardPage;
