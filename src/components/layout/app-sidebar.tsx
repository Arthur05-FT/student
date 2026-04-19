"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, PackagePlus } from "lucide-react";
import { useSchoolStore } from "@/store/school.store";
import { useUserStore } from "@/store/user.store";
import SignOutComponent from "../auth/sign-out.component";
import Link from "next/link";
import { sideBarLinks } from "@/lib/data";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import SearchComponent from "../shared/search.component";
import { FieldSeparator } from "../ui/field";

export function AppSidebar({
  schoolData,
  userData,
}: {
  schoolData: any;
  userData: any;
}) {
  const pathname = usePathname();
  useEffect(() => {
    useSchoolStore.setState({ schoolData });
    useUserStore.setState({ userData });
  }, [schoolData, userData]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Sélectionner le Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                {userData.schools.map((item: any, index: number) => (
                  <DropdownMenuItem key={index}>
                    <Link href={"/" + item.school.slug}>
                      {item.school.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <FieldSeparator />
                <DropdownMenuItem className="py-2">
                  <Link
                    className="flex gap-2 items-center w-full"
                    href={"/create-school"}
                  >
                    <PackagePlus />
                    Ajouter une école
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SearchComponent />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {sideBarLinks.map((links, i) => (
          <SidebarGroup key={i}>
            <SidebarGroupLabel>{links.title}</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-2">
              {links.subtitle.map((item, index) => {
                const href = `/${schoolData?.slug}${item?.link ?? ""}`;
                const isActive = pathname === href;

                return (
                  <Link
                    key={index}
                    href={href}
                    className={`flex items-center gap-2 hover:text-orange-500 transition-colors ${
                      isActive ? "text-orange-500" : ""
                    }`}
                  >
                    {item.icon}
                    {item.name}
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </Link>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {userData.name}
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <SignOutComponent />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
