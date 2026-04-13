// lib/store/school.store.ts
import { create } from "zustand";

interface School {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  city: string;
  country: string;
  type: string;
  users: any[];
  students: any[];
  classes: any[];
}

export interface SchoolStore {
  schoolData: School | null;
  setSchoolData: (school: School) => void;
}

export const useSchoolStore = create<SchoolStore>((set) => ({
  schoolData: null,
  setSchoolData: (schoolData) => set({ schoolData }),
}));
