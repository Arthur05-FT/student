import { notFound, redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SchoolDashboardProvider } from "@/lib/contexts/school-context";
import { schoolsApi } from "@/lib/api/schools.api";
import { usersApi } from "@/lib/api/users.api";
import { ApiError } from "@/lib/api/client";

const SchoolLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ schoolSlug: string }>;
}) => {
  const { schoolSlug } = await params;

  let school, user;
  try {
    [school, user] = await Promise.all([
      schoolsApi.bySlugServer(schoolSlug),
      usersApi.meServer(),
    ]);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) redirect("/sign-in");
      if (err.status === 403 || err.status === 404) notFound();
    }
    throw err;
  }

  const membership = user.schools.find((s) => s.schoolId === school.id);
  if (!membership) notFound();

  return (
    <SchoolDashboardProvider
      value={{ school, user, membershipRole: membership.role }}
    >
      <div className="flex min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">{children}</main>
        </SidebarProvider>
      </div>
    </SchoolDashboardProvider>
  );
};

export default SchoolLayout;
