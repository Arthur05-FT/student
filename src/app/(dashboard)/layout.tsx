"use client";

import { findSchoolName } from "@/actions/find-school-name.action";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CreateSchoolComponent } from "@/components/schools/create-school";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth/auth-client";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  if (session.isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
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
