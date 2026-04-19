import { auth } from "@/lib/auth";
import { findSchoolBySlug } from "@/lib/actions/school.action";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { findUserById } from "@/lib/actions/user.action";

const SchoolLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ schoolSlug: string }>; // Next 16 params est une Promise
}) => {
  const { schoolSlug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const school = await findSchoolBySlug(schoolSlug);
  if (!school) notFound();

  const user = await findUserById(session.user.id);

  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar schoolData={school} userData={user} />
        <main className="py-2 px-4">{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default SchoolLayout;
