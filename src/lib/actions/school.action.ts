"use server";

import { generateSlug } from "@/lib/generate-slug";
import { prisma } from "@/lib/prisma";
import { CreateSchoolForm } from "@/lib/schemas/school.schema";
import { auth } from "../auth";
import { headers } from "next/headers";

export const findSchoolByEmailUserName = async (email: string) => {
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

export const createSchool = async (data: CreateSchoolForm) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Veuillez vous reconnectez.");

  let slug = generateSlug(data.name);
  try {
    return await prisma.school.create({
      data: {
        name: data.name,
        email: data.email,
        slug,
        city: data.city,
        country: data.country,
        type: data.type,
        users: {
          connect: { id: session.user.id },
        },
      },
    });
  } catch (error: unknown) {
    if ((error as any) === "P2002") {
      throw new Error("Une école avec ces informations existe déjà");
    }
    throw error;
  }
};

export const findSchoolBySlug = async (slug: string) => {
  return await prisma.school.findUnique({
    where: { slug },
    include: {
      users: true,
      students: true,
      classes: true,
    },
  });
};
