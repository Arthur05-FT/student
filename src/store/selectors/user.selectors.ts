// lib/store/selectors/User.selectors.ts
import { useUserStore } from "../user.store";

export const useUserName = () => useUserStore((state) => state.userData?.name);

export const useUserSchool = () =>
  useUserStore((state) => state.userData?.school);

export const useUserEmail = () =>
  useUserStore((state) => state.userData?.email);
