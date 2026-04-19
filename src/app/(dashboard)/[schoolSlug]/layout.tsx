import { auth } from "@/lib/auth";
import {
  findSchoolBySlug,
  findUserSchoolMembership,
} from "@/lib/actions/school.action";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { findUserById } from "@/lib/actions/user.action";
import { SchoolDashboardProvider } from "@/lib/contexts/school-context";

const SchoolLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ schoolSlug: string }>;
}) => {
  const { schoolSlug } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const [school, user] = await Promise.all([
    findSchoolBySlug(schoolSlug),
    findUserById(session.user.id),
  ]);

  if (!school) notFound();
  if (!user) redirect("/sign-in");

  const membership = await findUserSchoolMembership(user.id, school.id);
  if (!membership) notFound();

  return (
    <SchoolDashboardProvider
      value={{ school, user, membershipRole: membership.role }}
    >
      <div className="flex min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <main className="px-4 flex-1">{children}</main>
        </SidebarProvider>
      </div>
    </SchoolDashboardProvider>
  );
};

export default SchoolLayout;
