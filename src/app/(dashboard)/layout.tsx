import { findSchoolByEmailUserName } from "@/lib/actions/school.action";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CreateSchoolComponent } from "@/components/schools/create-school.component";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const result = await findSchoolByEmailUserName(session?.user.email!);

  return (
    <div className="flex min-h-screen">
      {!result?.schoolName && result?.role === "DIRECTOR" && (
        <CreateSchoolComponent />
      )}
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
