# CLAUDE.md — EduCam · Backend

> Périmètre de Claude : tout ce qui est **backend** — Prisma, better-auth, Server Actions, middleware, validation Zod, API routes. Le frontend (composants, UI, stores, hooks client) est géré par le développeur.

---

## Stack réelle du projet

| Couche          | Technologie                           | Version    |
| --------------- | ------------------------------------- | ---------- |
| Framework       | Next.js App Router                    | ^16        |
| Langage         | TypeScript strict                     | ^5         |
| Base de données | PostgreSQL                            | —          |
| ORM             | Prisma + PrismaPg adapter             | ^7.8       |
| Auth            | **better-auth**                       | ^1.5       |
| Validation      | **Zod v4**                            | ^4.3       |
| Formulaires     | React Hook Form + @hookform/resolvers | côté front |
| Runtime         | React 19, Node.js                     | —          |

> Ne pas introduire de dépendances sans en discuter. Si une lib est nécessaire, le signaler explicitement.

---

## Règle absolue — Multi-tenant

**Chaque requête Prisma sur des données d'établissement DOIT filtrer par `schoolId`.**

```typescript
// ✅ CORRECT
const students = await prisma.student.findMany({
  where: { schoolId: session.schoolId },
});

// ❌ INTERDIT — fuite de données inter-tenant
const students = await prisma.student.findMany();
```

---

## Phase 1 — Fondation (commencer ici)

### 1.1 Prisma — configuration

Le client Prisma est instancié avec l'adaptateur PrismaPg (driver natif, sans pooler externe).

**`src/lib/prisma.ts`** — déjà en place, ne pas modifier :

```typescript
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

**`prisma.config.ts`** — déjà en place :

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  engine: "classic",
  datasource: { url: env("DATABASE_URL") },
});
```

> `url` ne va **pas** dans `schema.prisma` (Prisma 7). Elle est dans `prisma.config.ts`.

---

### 1.2 Helper multi-tenant

À créer dans `src/lib/prisma-tenant.ts` — wrapper qui injecte automatiquement le `schoolId` dans les `where` de lecture :

```typescript
import { prisma } from "./prisma";

export function getPrismaForSchool(schoolId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          args.where = { ...args.where, schoolId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, schoolId };
          return query(args);
        },
        async findUnique({ args, query }) {
          args.where = { ...args.where, schoolId } as typeof args.where;
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, schoolId };
          return query(args);
        },
      },
    },
  });
}
```

Usage dans une Server Action :

```typescript
const db = getPrismaForSchool(session.schoolId);
const students = await db.student.findMany(); // schoolId injecté automatiquement
```

---

### 1.3 Type partagé `ActionResult<T>`

À créer dans `src/lib/types.ts` — type de retour uniforme pour toutes les Server Actions :

```typescript
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

Toutes les Server Actions retournent ce type. Jamais de `throw` non attrapé.

---

### 1.4 Variables d'environnement

Fichier `.env` requis à la racine :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/educam"

# better-auth
BETTER_AUTH_SECRET="..."         # openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="..."
FROM_EMAIL="noreply@educam.cm"
```

---

## Phase 2 — Auth (better-auth)

### 2.1 Concepts better-auth

better-auth est différent de NextAuth :

- **Config serveur** dans `src/lib/auth.ts` via `betterAuth()`
- **Client** dans `src/lib/auth-client.ts` via `createAuthClient()` — côté frontend
- **Session serveur** via `auth.api.getSession(headers)` dans les Server Actions et Route Handlers
- **Middleware** via les cookies de session

### 2.2 Configuration serveur

À créer dans `src/lib/auth.ts` :

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // renouveau si < 1 jour restant
  },
  // Champs additionnels sur l'utilisateur
  user: {
    additionalFields: {
      role: { type: "string", required: true, defaultValue: "DIRECTOR" },
      schoolId: { type: "string", required: false },
      language: { type: "string", required: true, defaultValue: "fr" },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
```

### 2.3 Route handler

À créer dans `src/app/api/auth/[...all]/route.ts` :

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### 2.4 Helper session dans les Server Actions

À ajouter dans `src/lib/auth.ts` :

```typescript
import { headers } from "next/headers";

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

// Raccourci — lève une erreur si pas authentifié
export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

// Vérifie le rôle ET le schoolId (double sécurité multi-tenant)
export async function requireRole(role: "DIRECTOR" | "OWNER" | "SUPER_ADMIN") {
  const session = await requireSession();
  if (session.user.role !== role) throw new Error("FORBIDDEN");
  return session;
}
```

### 2.5 Middleware de protection des routes

À créer dans `src/middleware.ts` (remplace `src/proxy.ts`) :

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const ROLE_ROUTES: Record<string, string[]> = {
  "/owner": ["OWNER", "SUPER_ADMIN"],
  "/director": ["DIRECTOR", "SUPER_ADMIN"],
  "/teacher": ["TEACHER", "DIRECTOR", "SUPER_ADMIN"],
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Vérification de rôle par préfixe de route
  for (const [prefix, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      // La vérification fine du rôle se fait dans les Server Actions
      // Le middleware ne fait que vérifier l'existence de la session
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

---

## Phase 3 — Patterns Server Actions

### Structure d'une Server Action

```typescript
// src/lib/actions/students.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { getPrismaForSchool } from "@/lib/prisma-tenant";
import type { ActionResult } from "@/lib/types";

const CreateStudentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  classId: z.string().cuid(),
  subSystem: z.enum(["FRANCOPHONE", "ANGLOPHONE"]),
  parentPhone: z.string().min(8),
  gender: z.enum(["M", "F"]),
});

export async function createStudent(
  formData: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireRole("DIRECTOR");

    const parsed = CreateStudentSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Données invalides",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const db = getPrismaForSchool(session.user.schoolId!);
    const student = await db.student.create({
      data: {
        ...parsed.data,
        schoolId: session.user.schoolId!,
        status: "DRAFT",
      },
    });

    revalidatePath("/director/students");
    return { success: true, data: { id: student.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Non autorisé" };
    }
    console.error("[createStudent]", error);
    return { success: false, error: "Erreur serveur" };
  }
}
```

### Règles des Server Actions

- Fichier par domaine : `src/lib/actions/students.ts`, `classes.ts`, `payments.ts`, etc.
- Toujours `"use server"` en première ligne
- Toujours valider avec Zod avant toute requête DB
- Toujours vérifier rôle **ET** `schoolId`
- Jamais exposer les messages d'erreur Prisma bruts
- Retourner `ActionResult<T>` — jamais `throw` vers le client

### Transactions Prisma

Pour les opérations multi-tables atomiques :

```typescript
const result = await prisma.$transaction(async (tx) => {
  const student = await tx.student.create({
    data: { ...studentData, schoolId },
  });
  const enrollment = await tx.enrollment.create({
    data: {
      studentId: student.id,
      classId,
      schoolYearId,
      schoolId,
      status: "DRAFT",
    },
  });
  return { student, enrollment };
});
```

---

## Phase 4 — Modules backend (ordre recommandé)

### 4.1 Auth & Comptes _(à faire en premier)_

- [ ] `src/lib/auth.ts` — config better-auth complète
- [ ] `src/app/api/auth/[...all]/route.ts` — route handler
- [ ] `src/lib/auth.ts` — helpers `getSession`, `requireSession`, `requireRole`
- [ ] `src/middleware.ts` — protection des routes
- [ ] `src/lib/actions/auth.ts` — register (owner / director), reset-password

### 4.2 Établissements

- [ ] `src/lib/actions/schools.ts` — createSchool, updateSchool, inviteDirector
- [ ] `src/lib/actions/invitations.ts` — acceptInvitation (token → crée le compte)

### 4.3 Paramétrage établissement

- [ ] `src/lib/actions/school-years.ts` — createSchoolYear, setCurrentYear
- [ ] `src/lib/actions/class-levels.ts` — CRUD niveaux
- [ ] `src/lib/actions/classes.ts` — CRUD classes
- [ ] `src/lib/actions/subjects.ts` — CRUD matières + coefficients

### 4.4 Personnel

- [ ] `src/lib/actions/staff.ts` — createStaff, updateStaff, assignTeacher
- [ ] `src/lib/actions/leave-requests.ts` — createLeave, reviewLeave

### 4.5 Élèves & Inscriptions

- [ ] `src/lib/actions/students.ts` — createStudent, updateStudent, updateStatus
- [ ] `src/lib/actions/enrollments.ts` — createEnrollment, transferStudent

### 4.6 Paiements

- [ ] `src/lib/actions/fee-configs.ts` — CRUD configuration des frais
- [ ] `src/lib/actions/payments.ts` — recordPayment, generateReceiptNumber
- [ ] `src/app/api/webhooks/orange-money/route.ts` — webhook Mobile Money
- [ ] `src/app/api/webhooks/mtn-momo/route.ts` — webhook MTN

### 4.7 Notes

- [ ] `src/lib/actions/grades.ts` — upsertGrade, closeEvaluationPeriod
- [ ] Règle : vérifier que la période n'est pas clôturée avant toute écriture

### 4.8 Présences

- [ ] `src/lib/actions/attendance.ts` — createSheet, recordAttendance (bulk)

### 4.9 Communication & Notifications

- [ ] `src/lib/actions/messages.ts` — sendMessage
- [ ] `src/lib/actions/announcements.ts` — createAnnouncement
- [ ] `src/lib/actions/notifications.ts` — createNotification, markAsRead

---

## Phase 5 — Queries (lecture pour le frontend)

Les fonctions de lecture sont dans `src/lib/queries/` — utilisées par le frontend via TanStack Query ou directement dans les Server Components.

```typescript
// src/lib/queries/students.ts
import { getPrismaForSchool } from "@/lib/prisma-tenant";

export async function getStudents(
  schoolId: string,
  filters?: { classId?: string; status?: string },
) {
  const db = getPrismaForSchool(schoolId);
  return db.student.findMany({
    where: {
      ...(filters?.classId && {
        enrollments: { some: { classId: filters.classId } },
      }),
      ...(filters?.status && { status: filters.status as any }),
    },
    orderBy: { lastName: "asc" },
  });
}
```

---

## Conventions de code (backend)

### Nommage

- Server Actions : verbe + entité — `createStudent`, `updateSchool`, `deleteGrade`
- Fichiers actions : `kebab-case` — `src/lib/actions/school-years.ts`
- Fichiers queries : `kebab-case` — `src/lib/queries/students.ts`
- Modèles Prisma : `PascalCase` singulier — `Student`, `SchoolYear`

### Sécurité

- Vérifier **rôle + schoolId** dans chaque action mutante
- Ne jamais faire confiance aux `schoolId` envoyés par le client — toujours lire depuis la session
- Montants financiers : toujours en **centimes d'XAF** (entiers)

### Migrations

```bash
npx prisma migrate dev --name <nom-descriptif>  # développement
npx prisma migrate deploy                        # production
npx prisma generate                              # après modif schema
```

---

## Commandes utiles

```bash
npm run dev                    # démarrer le serveur
npx prisma studio              # interface visuelle BDD
npx prisma migrate dev         # créer + appliquer une migration
npx prisma generate            # régénérer le client
npx prisma db seed             # charger les données de test
```
