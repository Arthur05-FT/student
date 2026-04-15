"use server";

// src/lib/actions/user.action.ts
import { prisma } from "../prisma";

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      schools: {
        include: {
          school: true,
        },
      },
      sessions: true,
      accounts: true,
    },
  });
};
