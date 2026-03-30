"use server";

import { prisma } from "@/lib/prisma"; // ton instance prisma standalone
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function signInAction(identifier: string, password: string) {
  // Résolution : email ou phone ?
  const isEmail = identifier.includes("@");

  let email: string | null = null;

  if (isEmail) {
    email = identifier;
  } else {
    // Cherche l'email via le phone
    const user = await prisma.user.findUnique({
      where: { phone: identifier },
      select: { email: true },
    });

    if (!user || !user.email) {
      return { error: "Utilisateur introuvable" };
    }

    email = user.email;
  }

  // Better-auth travaille toujours avec l'email
  const result = await auth.api.signInEmail({
    body: { email, password },
    headers: await headers(),
  });

  if (!result) {
    return { error: "Identifiant ou mot de passe incorrect" };
  }

  return { success: true };
}
