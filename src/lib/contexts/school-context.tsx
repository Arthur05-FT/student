"use client";

import { createContext, useContext } from "react";
import type { SchoolDetail, SafeUser } from "@/lib/api/types";
import type { UserRole } from "@/lib/api/enums";

export interface SchoolDashboardContext {
  school: SchoolDetail;
  user: SafeUser;
  membershipRole: UserRole;
}

const SchoolContext = createContext<SchoolDashboardContext | null>(null);

export const SchoolDashboardProvider = ({
  value,
  children,
}: {
  value: SchoolDashboardContext;
  children: React.ReactNode;
}) => <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;

export const useSchoolDashboard = (): SchoolDashboardContext => {
  const ctx = useContext(SchoolContext);
  if (!ctx) {
    throw new Error(
      "useSchoolDashboard must be used inside SchoolDashboardProvider",
    );
  }
  return ctx;
};

export const useCurrentSchool = () => useSchoolDashboard().school;
export const useCurrentUser = () => useSchoolDashboard().user;
export const useMembershipRole = () => useSchoolDashboard().membershipRole;
