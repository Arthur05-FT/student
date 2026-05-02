// Types partagés frontend ↔ backend.
// À terme, à extraire dans un package partagé. Pour l'instant, dupliqués
// volontairement avec les selects Prisma utilisés côté NestJS.

import type { UserRole } from "./enums";

export type SchoolListItem = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  country: string | null;
  status: "ACTIVE" | "SUSPENDED";
  _count: { students: number; classes: number };
};

export type SchoolDetail = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  city: string | null;
  country: string | null;
  type: string | null;
  status: "ACTIVE" | "SUSPENDED";
  onboardingCompleted: boolean;
  classes: Array<{ id: string; name: string; createdAt: string }>;
  _count: { students: number; classes: number; users: number };
};

export type ClassesListItem = {
  id: string;
  code: string | null;
  level: string | null;
  name: string;
  room: string | null;
  building: string | null;
  capacity: string | null;
  headTeacherId: string | null;
  headTeacher: { id: string; firstname: string; lastname: string } | null;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
  _count: { students: number };
};

export type TeacherItem = {
  id: string;
  firstname: string;
  lastname: string;
  email: string | null;
  phone: string | null;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
};

export type ClassesDetail = ClassesListItem & {
  students: Array<{
    id: string;
    matricule: string;
    firstname: string;
    lastname: string;
    average: number | null;
  }>;
};

export type StudentItem = {
  id: string;
  matricule: string;
  firstname: string;
  lastname: string;
  email: string | null;
  phone: string | null;
  average: number | null;
  classId: string | null;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
  class: { id: string; name: string } | null;
};

export type StudentListResult = {
  items: StudentItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type SafeUser = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: UserRole | null;
  status: "ACTIVE" | "SUSPENDED";
  isActive: boolean;
  emailVerified: boolean;
  birthdate: string | null;
  createdAt: string;
  updatedAt: string;
  schools: Array<{
    id: string;
    schoolId: string;
    role: UserRole;
    joinedAt: string;
    school: {
      id: string;
      name: string;
      slug: string;
      status: "ACTIVE" | "SUSPENDED";
    };
  }>;
};

export type SchoolMember = {
  id: string;
  role: UserRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    image: string | null;
    status: "ACTIVE" | "SUSPENDED";
  };
};
