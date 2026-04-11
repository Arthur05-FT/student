import { findSchoolName } from "@/actions/find-school-name.action";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CreateSchoolComponent } from "@/components/schools/create-school";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const result = await findSchoolName(session?.user.email!);

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
