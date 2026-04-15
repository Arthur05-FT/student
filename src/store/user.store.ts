// lib/store/user.store.ts
import { create } from "zustand";

interface User {
  image: string | null;
  name: string;
  id: string;
  role: string;
  status: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  phone: string | null;
  isActive: boolean;
  schoolId: string | null;
  birthdate: Date | null;
  school: any[];
  sessions: any[];
}

export interface UserStore {
  userData: User | null;
  setUserData: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  setUserData: (userData) => set({ userData }),
}));
