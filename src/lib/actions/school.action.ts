"use server";

import { generateSlug } from "@/lib/generate-slug";
import { prisma } from "@/lib/prisma";
import { CreateSchoolForm } from "@/lib/schemas/school.schema";
import { auth } from "../auth";
import { headers } from "next/headers";

// find-school-by-email-user-name
export const findSchoolByEmailUserName = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        role: true,
        schools: {
          select: {
            school: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const firstSchool = user?.schools?.[0]?.school;

    return {
      schoolName: firstSchool?.name || null,
      role: user?.role,
    };
  } catch (error) {
    console.error("Erreur dans findSchoolByEmailUserName :", error);
    return { schoolName: null, role: null };
  }
};

// create-school
export const createSchool = async (data: CreateSchoolForm) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Veuillez vous reconnecter.");
  }

  const slug = generateSlug(data.name);

  try {
    const newSchool = await prisma.school.create({
      data: {
        name: data.name,
        email: data.email,
        slug,
        city: data.city,
        country: data.country,
        type: data.type,
        users: {
          create: {
            userId: session.user.id,
            role: "DIRECTOR",
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    return newSchool;
  } catch (error: unknown) {
    console.error("Erreur lors de la création de l'école :", error);

    if ((error as any)?.code === "P2002") {
      throw new Error("Une école avec ce nom ou ce slug existe déjà.");
    }

    throw new Error("Une erreur est survenue lors de la création de l'école.");
  }
};

// find-school-by-slug
export const findSchoolBySlug = async (slug: string) => {
  return await prisma.school.findUnique({
    where: { slug },
    include: {
      users: {
        include: {
          user: true,
        },
      },
      students: true,
      classes: true,
    },
  });
};
