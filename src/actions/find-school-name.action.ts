"use server";

import { prisma } from "@/lib/prisma";

export const findSchoolName = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        role: true,
        school: {
          select: {
            name: true,
          },
        },
      },
    });
    return { schoolName: user?.school?.name || null, role: user?.role };
  } catch (error) {
    console.log("Nous avons rencontré une erreur : ", error);
  }
};
