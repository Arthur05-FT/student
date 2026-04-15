"use client";

import { SidebarMenuButton } from "../ui/sidebar";
import { useSignOut } from "@/lib/hooks/use-auth";

const SignOutComponent = () => {
  const signOut = useSignOut();
  return (
    <SidebarMenuButton onClick={() => signOut()}>
      <span className="text-red-500">Se déconnecter</span>
    </SidebarMenuButton>
  );
};

export default SignOutComponent;
