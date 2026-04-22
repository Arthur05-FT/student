# Historique des refactorings

Ce document décrit, dans l'ordre chronologique, les **modifications majeures** apportées au projet, avec le **pourquoi** et le **comment** de chaque changement. Lecture recommandée pour comprendre l'état actuel du code.

---

## 📋 Résumé des phases

1. [Audit initial](#1-audit-initial--problèmes-identifiés) — détection des problèmes
2. [Sécurité critique](#2-phase-sécurité-critique) — fix des failles bloquantes
3. [Schéma Prisma](#3-phase-schéma-prisma) — durcissement DB + migration
4. [Architecture](#4-phase-architecture--typage--dx) — typage strict, contexte React, factorisation
5. [CRUD complet](#5-phase-crud-complet-server-actions) — server actions Schools/Classes/Students/Users
6. [Migration NestJS](#6-phase-migration-vers-nestjs) — séparation backend/frontend
7. [Fix post-migration](#7-fix-post-migration--bug-distmain) — correction du bug `dist/main`

---

## 1. Audit initial — problèmes identifiés

Une analyse complète du projet de départ (monolithe Next.js 16 avec Prisma + Better Auth + Zustand) a révélé **plusieurs problèmes critiques**.

### 🔴 Failles de sécurité

| # | Problème | Localisation initiale |
|---|---|---|
| 1 | Pas de vérification d'appartenance à l'école — un user authentifié pouvait accéder aux données de **n'importe quelle école** via le slug | `src/app/(dashboard)/[schoolSlug]/layout.tsx` |
| 2 | `findUserById` retournait `sessions` + `accounts` au client → **fuite de tokens d'auth** | `src/lib/actions/user.action.ts` |
| 3 | `createSchool` n'avait aucun check RBAC — n'importe qui pouvait créer une école et devenir DIRECTOR | `src/lib/actions/school.action.ts` |
| 4 | `SearchComponent` avait `type="password"` → champ recherche masqué | `src/components/shared/search.component.tsx` |

### 🟠 Problèmes majeurs

- **Typage cassé** : `any` dans `app-sidebar.tsx`, `school.store.ts`, `user.store.ts`
- **Schéma Prisma** : `updateAt` au lieu de `updatedAt`, `Classes.schoolId` sans `onDelete: Cascade`, **pas d'index** sur les FK, `User.role` redondant avec `UserSchool.role`
- **Validation cassée** : `emailSchema = z.string()` sans `.email()`, phone limité à 9 chars
- **Hydration mismatch** sur `[schoolSlug]/page.tsx` (affichage `undefined.` au premier rendu car le store Zustand était vide)
- **Anti-pattern Zustand** : la sidebar mutait le store via `useEffect` (prop-drilling déguisé)
- **Gestion d'erreurs Prisma** : cast `(error as any)` au lieu d'utiliser `Prisma.PrismaClientKnownRequestError`

### 🟡 Mineurs

- `axios` et `@tanstack/react-query` installés mais **inutilisés**
- Pages stubs vides (`calendar`, `settings`, etc.)
- `console.error` en prod
- ESLint sans règle `no-explicit-any`
- `use(params)` au lieu de `await params` dans un Server Component

---

## 2. Phase sécurité critique

### 2.1 Guard d'appartenance à l'école

**Avant** :
```typescript
const school = await findSchoolBySlug(schoolSlug);
const user = await findUserById(session.user.id);
return <AppSidebar schoolData={school} userData={user} />;
```

**Après** :
```typescript
const [school, user] = await Promise.all([...]);
if (!school) notFound();
if (!user) redirect("/sign-in");

const membership = await findUserSchoolMembership(user.id, school.id);
if (!membership) notFound();  // ← clé : pas membre = 404
```

**Pourquoi** : à chaque accès à une ressource via URL, il faut vérifier que l'utilisateur a le droit d'y accéder. Sans cette vérification, le site est ouvert à tous les vents.

### 2.2 Helper de sécurité réutilisable

Création de `src/lib/auth-guards.ts` qui factorise les vérifs :

```typescript
export const requireSession = async (): Promise<SessionContext> => { ... };
export const requireSchoolMembership = async (schoolId: string) => { ... };
export const requireSchoolMembershipBySlug = async (slug: string) => { ... };
export const assertRole = (membership, allowedRoles) => { ... };

export const ROLES = {
  STAFF: ["SUPER_ADMIN", "DIRECTOR", "ADMIN"],
  ADMINS: ["SUPER_ADMIN", "DIRECTOR"],
  DIRECTOR_ONLY: ["SUPER_ADMIN", "DIRECTOR"],
};
```

**Pourquoi** : si la logique sécurité est éparpillée, on l'oublie. Un helper centralisé garantit l'application uniforme et facilite l'audit.

### 2.3 `findUserById` strict en sortie

**Avant** :
```typescript
include: {
  sessions: true,    // ← contient les tokens de session
  accounts: true,    // ← contient les hash de mot de passe + tokens OAuth
}
```

**Après** :
```typescript
select: {
  id: true, name: true, email: true, /* ... champs publics uniquement ... */,
  schools: { select: { /* ... */ } }
  // sessions et accounts JAMAIS retournés
}
```

**Pourquoi** : tout ce qui est retourné par une server action est sérialisé dans le HTML envoyé au navigateur. Un attaquant (XSS, extension malveillante) peut le voler. **Règle absolue** : `select` explicite, jamais `include` aveugle.

### 2.4 RBAC sur `createSchool` + handling d'erreurs typé

```typescript
catch (error) {
  throw handlePrismaError(error, {
    P2002: "Une école avec ce nom existe déjà.",
    default: "Erreur lors de la création de l'école.",
  });
}
```

**Pourquoi** : avant, on castait en `(error as any).code`. Maintenant, `handlePrismaError` typé centralise la traduction des codes Prisma (`P2002` = conflit unique, `P2025` = not found) en `AppError` avec messages métiers.

### 2.5 Fix `SearchComponent`

`type="password"` → `type="search"` + ajout d'icône loupe.

---

## 3. Phase schéma Prisma

Migration **`20260419220000_schema_hardening`** appliquée :

```sql
-- Renommage colonnes (préserve les données, contrairement à drop+create)
ALTER TABLE "Classes" RENAME COLUMN "updateAt" TO "updatedAt";
ALTER TABLE "Student" RENAME COLUMN "updateAt" TO "updatedAt";

-- Cascade delete : si une école est supprimée, ses classes et étudiants suivent
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_schoolId_fkey";
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_schoolId_fkey"
  FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE;

-- Indexes pour perf des requêtes fréquentes
CREATE INDEX "Classes_schoolId_idx" ON "Classes"("schoolId");
CREATE INDEX "Student_schoolId_idx" ON "Student"("schoolId");
CREATE INDEX "Student_classId_idx" ON "Student"("classId");

-- Pas deux classes avec le même nom dans la même école
CREATE UNIQUE INDEX "Classes_schoolId_name_key" ON "Classes"("schoolId", "name");

-- User.role nullable : SUPER_ADMIN explicite, sinon le rôle est par-école dans UserSchool
ALTER TABLE "User" ALTER COLUMN "role" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
```

**Pourquoi écrire la migration à la main** : `prisma migrate dev` détecte un renommage comme `DROP + CREATE`, ce qui **perd les données**. Pour préserver l'existant, on écrit `RENAME COLUMN` à la main.

---

## 4. Phase architecture — typage + DX

### 4.1 Suppression de Zustand → React Context

**Avant** : la sidebar utilisait des stores Zustand mutés via `useEffect` depuis le layout :
```typescript
useEffect(() => {
  useSchoolStore.setState({ schoolData });  // ← anti-pattern
}, [schoolData]);
```

**Après** : un **Context** alimenté directement par le layout serveur :
```typescript
// src/lib/contexts/school-context.tsx
export const SchoolDashboardProvider = ({ value, children }) => (
  <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>
);

export const useCurrentSchool = () => useSchoolDashboard().school;
```

**Pourquoi** :
- Pas d'hydration mismatch (le context a sa valeur dès le premier rendu)
- Typage strict propagé (vs Zustand où on triche avec `any`)
- Un seul endroit qui décide qui peuple le state (le layout serveur)
- Zustand reste utile pour de l'état VRAIMENT global qui change ; ici c'était du prop-drilling déguisé

### 4.2 Suppression complète des `any`

Tous les `any` du code applicatif ont été remplacés par des types Prisma générés ou des types React Hook Form :

```typescript
// AVANT
const PasswordField = ({ register: any, formState: any }) => { ... }

// APRÈS
const PasswordField = <T extends FieldValues>({
  register, formState, name = "password" as Path<T>,
}: { register: UseFormRegister<T>; formState: FormState<T>; name?: Path<T> }) => { ... }
```

### 4.3 Validation Zod corrigée

```typescript
// AVANT
const emailSchema = z.string();  // accepte n'importe quoi

// APRÈS
const emailSchema = z.string().email({ message: "Email invalide" });
const phoneSchema = z.string().regex(/^\+?[0-9\s().-]{8,20}$/, ...);
```

### 4.4 Factorisation des composants auth

**Avant** : `sign-in.component.tsx` et `sign-up.component.tsx` étaient quasi-identiques (~80 LOC chacun).

**Après** : extraction de :
- `AuthFormShell` : layout commun (titre, description, submit, footer link)
- `IdentifierField` : champ email/téléphone réutilisable
- `PasswordField` : champ password générique typé `<T extends FieldValues>`

Les deux pages sont passées à ~30 LOC chacune.

### 4.5 Service auth en pattern Result

**Avant** : callback hell avec `setIsSubmitting`, `setBetterAuthErrors`, `router` passés en paramètres.

**Après** : retour discriminé `Result` :
```typescript
export type AuthResult = { ok: true } | { ok: false; error: string };

export async function signInService(formData: SignInForm): Promise<AuthResult> {
  const { error } = await authClient.signIn.email({ ... });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
```

Le hook `useSignIn` gère ensuite l'effet (redirect ou affichage erreur).

### 4.6 Nettoyage dépendances + ESLint durci

- Supprimé : `axios`, `@tanstack/react-query`, `lucide` (doublon de `lucide-react`)
- Bumpé : `prisma` CLI 6.19.3 → 7.6.0 (alignement avec `@prisma/client`)
- ESLint :
  ```js
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  "@typescript-eslint/no-non-null-assertion": "warn",
  ```
- Proxy middleware simplifié et matcher lisible

---

## 5. Phase CRUD complet (server actions)

Mise en place du **CRUD complet** pour toutes les entités, suivant un pattern unifié.

### 5.1 Pattern unique pour chaque action

```typescript
export const createX = async (input: CreateXInput) => {
  // 1. Validation Zod
  const data = createXSchema.parse(input);

  // 2. Sécurité : session + appartenance + rôle
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);
  assertRole(membership, ROLES.STAFF);

  // 3. Opération DB avec where filtré (id + schoolId)
  try {
    const created = await prisma.x.create({
      data: { ..., schoolId: membership.schoolId },
      select: xSelect,  // ← pas d'over-fetch
    });

    // 4. Invalider le cache Next.js
    revalidatePath(`/${data.schoolSlug}/...`);

    return created;
  } catch (error) {
    throw handlePrismaError(error, { P2002: "...", P2025: "...", default: "..." });
  }
};
```

### 5.2 Modules créés

| Entité | Fichier | Opérations | RBAC |
|---|---|---|---|
| **Classes** | `classes.action.ts` | list, getById, create, update, delete | STAFF (CRUD), ADMINS (delete) |
| **Student** | `student.action.ts` | list (pagination + recherche), getById, create, update, delete | STAFF |
| **School** | `school.action.ts` | listMy, byEmail, bySlug, membership, create, update, delete | ADMINS (update), DIRECTOR (delete) |
| **User** | `user.action.ts` | findById, getCurrent, updateProfile, listMembers, updateMembershipRole, removeMembership | DIRECTOR_ONLY (membres) |

### 5.3 Patterns de sécurité appliqués

- **Filtre composé `where: { id, schoolId }`** : empêche les attaques par énumération d'ID inter-écoles
- **`assertClassBelongsToSchool`** : vérifie que les FK passées appartiennent bien à l'école courante
- **`select` strict** : jamais de fuite de tokens
- **Erreurs Prisma typées** : codes `P2002`, `P2025` traduits en messages métier

### 5.4 Types dérivés

Les fichiers `"use server"` ne peuvent exporter que des fonctions async. Les types sont donc dans des fichiers séparés `*.types.ts` :

```typescript
// classes.types.ts
import type { listClasses, getClassesById } from "./classes.action";
export type ClassesListItem = Awaited<ReturnType<typeof listClasses>>[number];
export type ClassesDetail = NonNullable<Awaited<ReturnType<typeof getClassesById>>>;
```

---

## 6. Phase migration vers NestJS

**Objectif** : séparer le backend dans une application NestJS dédiée, garder Better Auth pour l'auth, le tout sans casser le frontend.

### 6.1 Structure cible

```
student/
├── src/                  ← Next.js (port 3000) - frontend pur
└── apps/api/             ← NestJS (port 3001) - backend
```

Choix : **monorepo simple** sans workspaces npm pour démarrer (les schemas Zod sont dupliqués pour l'instant). Les deux projets ont leur propre `package.json` et leur propre `node_modules`.

### 6.2 Bootstrap NestJS

Création de `apps/api/` avec :
- `package.json` (NestJS 11, Better Auth, Prisma 7, nestjs-zod, etc.)
- `tsconfig.json` (strict, decorators activés)
- `nest-cli.json`

### 6.3 Better Auth dans NestJS

Better Auth est un framework Node-agnostic. Pour NestJS :

```typescript
// auth.controller.ts
import { toNodeHandler } from "better-auth/node";
const handler = toNodeHandler(auth);

@Controller("api/auth")
export class AuthController {
  @All("*path")  // tous les verbes, tous les chemins sous /api/auth
  async handle(@Req() req, @Res() res) {
    await handler(req, res);
  }
}
```

**Subtilité critique** dans `main.ts` :
```typescript
const app = await NestFactory.create(AppModule, { bodyParser: false });
```

Better Auth a besoin du **Request brut** (le stream). Si NestJS l'a déjà parsé en JSON, Better Auth ne peut plus le lire. Solution : désactiver le body parser global et le réactiver **conditionnellement** :

```typescript
const skipAuth = (req) => req.path.startsWith("/api/auth");
app.use((req, res, next) => skipAuth(req) ? next() : jsonParser(req, res, next));
```

### 6.4 Couche `common/` (port direct des helpers Next.js)

| Fichier | Rôle |
|---|---|
| `errors.ts` | `AppError` + `handlePrismaError` (identique au frontend précédent) |
| `filters/app-exception.filter.ts` | Mappe `AppError` → status HTTP, `ZodError` → 422, autres → 500 |
| `pipes/zod-validation.pipe.ts` | Réutilise les schemas Zod via `schema.parse(value)` |
| `guards/session.guard.ts` | Vérifie la session Better Auth, attache `req.session` |
| `guards/membership.guard.ts` | Lit `:schoolSlug`, vérifie l'appartenance, applique `@Roles()` |
| `decorators/session.decorator.ts` | `@Session()` extrait `req.session` |
| `decorators/membership.decorator.ts` | `@CurrentMembership()` extrait `req.membership` |
| `decorators/roles.decorator.ts` | `@Roles(...UserRole[])` + presets `ROLES.STAFF/ADMINS/...` |

### 6.5 Modules métier

Chaque domaine = un dossier avec **3 fichiers** (pattern NestJS) :

```
apps/api/src/classes/
├── classes.module.ts        ← module : déclaration
├── classes.controller.ts    ← reçoit HTTP, vérifie droits, appelle service
└── classes.service.ts       ← logique métier + accès DB
```

Le **controller ne parle jamais à Prisma directement**, le service ne connaît pas HTTP. Séparation des responsabilités stricte.

Exemple :
```typescript
@Controller("schools/:schoolSlug/classes")
@UseGuards(SessionGuard, MembershipGuard)
export class ClassesController {
  constructor(private readonly classes: ClassesService) {}

  @Post()
  @Roles(...ROLES.STAFF)
  create(
    @CurrentMembership() m: Membership,
    @Body(new ZodValidationPipe(createClassesSchema)) body: CreateClassesDto,
  ) {
    return this.classes.create(m.schoolId, body);
  }
}
```

### 6.6 Adaptation du frontend

Suppression du backend embarqué dans Next.js :
- `src/lib/actions/` ❌
- `src/lib/auth.ts` ❌
- `src/lib/auth-guards.ts` ❌
- `src/lib/errors.ts` ❌
- `src/lib/prisma.ts` ❌
- `src/app/api/auth/[...all]/route.ts` ❌

Remplacement par un **client API typé** :

```
src/lib/api/
├── client.ts              ← apiFetch + ApiError (browser)
├── server.ts              ← serverApiFetch (Server Components, forward cookies)
├── enums.ts               ← UserRole etc. (découplé Prisma)
├── types.ts               ← types des réponses API
├── schools.api.ts
├── classes.api.ts
├── students.api.ts
└── users.api.ts
```

**`apiFetch`** générique :
```typescript
const res = await fetch(url, {
  method: opts.method ?? "GET",
  credentials: "include",  // ← envoie le cookie Better Auth
  headers: { "Content-Type": "application/json", ... },
  body: opts.body ? JSON.stringify(opts.body) : undefined,
});

if (!res.ok) throw new ApiError(res.status, payload.code, payload.message);
return await res.json();
```

**`serverApiFetch`** : variante pour les Server Components, forward le cookie de la requête entrante :
```typescript
const h = await headers();
const cookieHeader = h.get("cookie");
return apiFetch<T>(path, { ...opts, cookieHeader });
```

### 6.7 Layout adapté

**Avant** : appel direct à Prisma + Better Auth.

**Après** :
```typescript
try {
  [school, user] = await Promise.all([
    schoolsApi.bySlugServer(schoolSlug),
    usersApi.meServer(),
  ]);
} catch (err) {
  if (err instanceof ApiError) {
    if (err.status === 401) redirect("/sign-in");
    if (err.status === 403 || err.status === 404) notFound();
  }
  throw err;
}
```

### 6.8 CORS

```typescript
app.enableCors({
  origin: "http://localhost:3000",
  credentials: true,  // ← crucial pour les cookies cross-origin
});
```

### 6.9 Reconfig `authClient`

```typescript
// AVANT : Better Auth dans Next.js
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
});

// APRÈS : Better Auth dans NestJS
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
});
```

### 6.10 Suppression dépendances frontend devenues inutiles

`@prisma/client`, `@prisma/adapter-pg`, `pg`, `@types/pg`, `prisma`, `dotenv`, `slugify`, `unique-username-generator` retirées du `package.json` racine. Économie ~50 MB de `node_modules`.

---

## 7. Fix post-migration — bug `dist/main`

Après la migration NestJS, le `nest start` plantait :
```
Cannot find module 'D:\Projets\student\apps\api\dist\main'
```

Alors que `tsc` disait "Found 0 errors". 🤔

### Cause racine

NestJS importait :
```typescript
import { PrismaClient } from "../../../../generated/prisma/client";
```

Ce chemin pointait HORS de `apps/api/src/`. TypeScript a alors remonté son `rootDir` au niveau du repo entier. Du coup l'output a perdu sa structure :
- **Attendu** : `dist/main.js`
- **Réel** : `dist/apps/api/src/main.js`

### Fix : tout Prisma déplacé dans `apps/api/`

```
AVANT :
student/
├── prisma/                    ← schema partagé (legacy monolithe)
├── generated/prisma/          ← client (HORS apps/api/src)
└── apps/api/src/main.ts       ← importe ../../../../generated/...

APRÈS :
student/
└── apps/api/
    ├── prisma/                ← schema (le backend possède la DB)
    ├── prisma.config.ts
    └── src/
        ├── generated/prisma/  ← client (DANS src/)
        └── main.ts            ← importe ../generated/prisma/client
```

Modifications :
- `mv prisma/ apps/api/prisma/` (et `prisma.config.ts`)
- Schema generator output : `"../src/generated/prisma"` (relatif au schema)
- Imports NestJS : `"../generated/prisma/client"` (chemins courts locaux)
- `src/generated/**` exclu du `tsconfig` (le client a déjà `@ts-nocheck`)
- Prisma CLI ajouté à `apps/api/devDependencies` + scripts `prisma:generate/migrate/deploy`

### Fix bonus

- Warning `path-to-regexp v6` corrigé : `@All("*")` → `@All("*path")` (nouveau format wildcard nommé)
- `.gitignore` mis à jour : `node_modules/` (récursif), `dist/`, `apps/api/src/generated/`, `.env*`
- `git rm --cached apps/api/dist apps/api/node_modules` pour détracker ce qui avait fuité

---

## 📌 Conventions à respecter pour la suite

### Côté backend (NestJS)

1. **Nouvelles routes** : créer un module `apps/api/src/<entité>/` avec `module.ts`, `controller.ts`, `service.ts`
2. **Validation** : créer un schema Zod dans `apps/api/src/schemas/` et l'utiliser via `new ZodValidationPipe(schema)`
3. **Sécurité** : appliquer `@UseGuards(SessionGuard, MembershipGuard)` + `@Roles(...ROLES.X)` au niveau controller ou méthode
4. **Erreurs** : ne jamais retourner `res.status(...)`. Lancer `throw new AppError(message, code)` ; le filter s'occupe du HTTP
5. **DB** : toujours `select` explicite, jamais `include` aveugle. Filtrer par `schoolId` quand pertinent

### Côté frontend (Next.js)

1. **Appels API** : passer par `src/lib/api/<entité>.api.ts`. Ne jamais faire de `fetch` direct
2. **Erreurs** : `try/catch` autour des appels API, gérer `ApiError` avec ses status (401/403/404/422/500)
3. **Server Components** : utiliser les variantes `*Server()` qui forward les cookies
4. **Pas de `any`** : si bloqué, demander de l'aide ; il y a presque toujours un meilleur type
5. **Validation formulaires** : schemas Zod dans `src/lib/schemas/` (séparés des schemas backend pour découpler)

### Git

1. Ne JAMAIS commiter `node_modules/`, `dist/`, `.next/`, `.env`, `apps/api/src/generated/`
2. Jamais d'amend sur des commits déjà pushés
3. Migrations Prisma : à la main pour les renommages (préserver les données)

---

## 🔗 Liens utiles

- [README.md](./README.md) — vue d'ensemble du projet
- [Better Auth docs](https://www.better-auth.com/docs)
- [NestJS docs](https://docs.nestjs.com)
- [Prisma docs](https://www.prisma.io/docs)
