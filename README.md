# Skoul — Plateforme de gestion scolaire

Application SaaS de gestion d'établissements scolaires : écoles, classes, étudiants, équipes pédagogiques. Architecture **frontend + backend séparés**.

---

## 🏗️ Architecture

Le projet est organisé en **monorepo simple** avec deux applications indépendantes qui partagent uniquement la base de données PostgreSQL.

```
student/
├── src/                          ← FRONTEND Next.js 16 (port 3000)
│   ├── app/
│   │   ├── (auth)/               ← pages publiques (sign-in, sign-up)
│   │   └── (dashboard)/          ← pages protégées (école, classes, etc.)
│   ├── components/               ← composants React + shadcn/ui
│   ├── lib/
│   │   ├── api/                  ← client HTTP typé vers le backend
│   │   ├── contexts/             ← React Context (school dashboard scope)
│   │   ├── hooks/                ← hooks réutilisables (forms, auth)
│   │   ├── schemas/              ← schemas Zod (validation côté formulaire)
│   │   ├── services/             ← wrapper Better Auth client
│   │   └── auth-client.ts        ← config Better Auth (browser)
│   └── proxy.ts                  ← middleware Next.js (redirection auth)
│
├── apps/api/                     ← BACKEND NestJS 11 (port 3001)
│   ├── prisma/
│   │   ├── schema.prisma         ← modèle de données
│   │   └── migrations/           ← historique SQL
│   ├── prisma.config.ts
│   └── src/
│       ├── main.ts               ← bootstrap (CORS, body parser, filter)
│       ├── app.module.ts         ← module racine
│       ├── prisma/               ← PrismaService global
│       ├── auth/                 ← Better Auth handler + service
│       ├── common/
│       │   ├── errors.ts         ← AppError + handlePrismaError
│       │   ├── filters/          ← AppExceptionFilter (AppError → HTTP)
│       │   ├── pipes/            ← ZodValidationPipe
│       │   ├── guards/           ← SessionGuard, MembershipGuard
│       │   └── decorators/       ← @Session, @CurrentMembership, @Roles
│       ├── schemas/              ← schemas Zod (DTO validation)
│       ├── schools/              ← controller + service + module
│       ├── classes/
│       ├── students/
│       └── users/
│
└── package.json                  ← deps frontend uniquement
```

### Flux d'une requête

```
[Navigateur]
    │
    │ GET /mon-ecole/classes
    ▼
[Next.js : 3000]                 ← rendu UI uniquement
    │
    │ fetch GET /schools/mon-ecole/classes
    │ (cookies Better Auth inclus, credentials: include)
    ▼
[NestJS : 3001]
    │
    ├─ SessionGuard               ← qui appelle ?
    ├─ MembershipGuard            ← est-ce qu'il a accès à cette école ?
    ├─ @Roles(STAFF) si requis    ← a-t-il le bon rôle ?
    │
    ▼
[ClassesController.list()]
    │
    ▼
[ClassesService.list()]           ← logique métier
    │
    ▼
[Prisma]
    │
    ▼
[PostgreSQL]
```

---

## 🛠️ Stack technique

### Frontend (`/`)

| Domaine | Choix |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Langage | TypeScript strict |
| UI | **Tailwind 4** + **shadcn/ui** + Radix UI + Base UI |
| Formulaires | **react-hook-form** + Zod |
| Auth (client) | **Better Auth** (`better-auth/react`) |
| State | React Context (pas de store global) |
| Tables | TanStack Table |

### Backend (`/apps/api`)

| Domaine | Choix |
|---|---|
| Framework | **NestJS 11** + Express |
| ORM | **Prisma 7** + adapter `pg` |
| DB | **PostgreSQL** |
| Auth | **Better Auth** (handler monté sur `/api/auth/*`) |
| Validation | **Zod** via `ZodValidationPipe` custom |
| Gestion erreurs | `AppError` + `AppExceptionFilter` global |

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js ≥ 20
- PostgreSQL ≥ 14 lancé en local
- Une base `school_saas` créée (`createdb school_saas`)

### Installation

```bash
# 1. Frontend (à la racine)
npm install

# 2. Backend
cd apps/api
npm install
cp .env.example .env       # puis remplir DATABASE_URL et BETTER_AUTH_SECRET
npx prisma generate
npx prisma migrate deploy  # applique les migrations existantes
cd ../..
```

### Variables d'environnement

**`/.env`** (frontend) :
```
DATABASE_URL="postgresql://user:pass@localhost:5432/school_saas?schema=public"
BETTER_AUTH_SECRET="<même valeur que apps/api/.env>"
BETTER_AUTH_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

**`/apps/api/.env`** (backend) :
```
DATABASE_URL="postgresql://user:pass@localhost:5432/school_saas?schema=public"
BETTER_AUTH_SECRET="<même valeur partagée>"
BETTER_AUTH_URL="http://localhost:3001"
WEB_ORIGIN="http://localhost:3000"
PORT=3001
```

> ⚠️ Le `BETTER_AUTH_SECRET` doit être **identique** des deux côtés pour que les cookies de session soient compatibles.

### Lancement

Dans deux terminaux :

```bash
# Terminal A — API NestJS (port 3001)
cd apps/api
npm run start:dev

# Terminal B — Web Next.js (port 3000)
npm run dev
```

L'app est dispo sur [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Modèle de données

```
School ──┬── UserSchool ── User
         │       (rôle par école)
         ├── Classes ── Student
         └── Student
```

### Entités

- **School** : établissement (slug unique pour le routing)
- **User** : compte utilisateur (rôle global optionnel pour SUPER_ADMIN)
- **UserSchool** : table de jointure avec `role` par école (DIRECTOR, ADMIN, TEACHER)
- **Classes** : salles de classe d'une école
- **Student** : étudiants rattachés à une école et optionnellement à une classe
- **Session, Account, Verification** : tables Better Auth

### Rôles (RBAC)

| Rôle | Portée |
|---|---|
| `SUPER_ADMIN` | Plateforme entière |
| `DIRECTOR` | Tout dans son école (créer/supprimer école, gérer membres) |
| `ADMIN` | Tout dans son école sauf gestion des membres |
| `TEACHER` | Lecture seule |

Presets disponibles dans `apps/api/src/common/decorators/roles.decorator.ts` :
- `ROLES.STAFF` : SUPER_ADMIN + DIRECTOR + ADMIN
- `ROLES.ADMINS` : SUPER_ADMIN + DIRECTOR
- `ROLES.DIRECTOR_ONLY` : SUPER_ADMIN + DIRECTOR

---

## 🌐 API REST

Toutes les routes sont préfixées par `http://localhost:3001`.

### Authentification (Better Auth)

```
POST  /api/auth/sign-in/email
POST  /api/auth/sign-up/email
POST  /api/auth/sign-out
GET   /api/auth/session
... (toutes les routes Better Auth)
```

### Schools

| Méthode | Route | Rôle requis |
|---|---|---|
| GET | `/schools` | authentifié |
| POST | `/schools` | authentifié |
| GET | `/schools/:slug` | membre |
| PATCH | `/schools/:slug` | ADMINS |
| DELETE | `/schools/:slug` | DIRECTOR_ONLY |
| GET | `/schools/lookup-by-email?email=...` | authentifié |

### Classes (par école)

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/schools/:slug/classes` | membre |
| GET | `/schools/:slug/classes/:id` | membre |
| POST | `/schools/:slug/classes` | STAFF |
| PATCH | `/schools/:slug/classes/:id` | STAFF |
| DELETE | `/schools/:slug/classes/:id` | ADMINS |

### Students (par école)

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/schools/:slug/students?page=&pageSize=&classId=&search=` | membre |
| GET | `/schools/:slug/students/:id` | membre |
| POST | `/schools/:slug/students` | STAFF |
| PATCH | `/schools/:slug/students/:id` | STAFF |
| DELETE | `/schools/:slug/students/:id` | STAFF |

### Users / Membres

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/me` | authentifié |
| PATCH | `/me` | authentifié |
| GET | `/schools/:slug/members?search=` | membre |
| PATCH | `/schools/:slug/members/:userId` | DIRECTOR_ONLY |
| DELETE | `/schools/:slug/members/:userId` | DIRECTOR_ONLY |

### Format des erreurs

```json
{
  "statusCode": 403,
  "code": "FORBIDDEN",
  "message": "Vous n'avez pas les droits pour cette action."
}
```

Avec validation Zod échouée :

```json
{
  "statusCode": 422,
  "code": "VALIDATION",
  "message": "Validation échouée",
  "issues": [ /* détails Zod */ ]
}
```

---

## 🔒 Sécurité

- **Vérification d'appartenance** systématique via `MembershipGuard` (lit `:schoolSlug` dans l'URL)
- **RBAC** par décorateur `@Roles(...ROLES.X)` après `MembershipGuard`
- **Sessions** chiffrées via cookies HttpOnly (Better Auth)
- **CORS strict** : seul `WEB_ORIGIN` est autorisé avec `credentials: true`
- **`select` Prisma strict** : sessions/accounts/tokens jamais retournés au client
- **Filtre par `schoolId`** dans tous les `where` (empêche les attaques par énumération d'IDs)
- **Validation Zod** à l'entrée de chaque endpoint

---

## 📝 Scripts utiles

### Frontend (à la racine)

```bash
npm run dev          # Next.js en dev (port 3000)
npm run build        # build production
npm run lint         # ESLint
```

### Backend (`/apps/api`)

```bash
npm run start:dev        # NestJS en watch mode (port 3001)
npm run build            # compile vers dist/
npm run start:prod       # node dist/main

npm run prisma:generate  # régénère le client Prisma
npm run prisma:migrate   # crée + applique une migration en dev
npm run prisma:deploy    # applique les migrations en prod/CI
```

---

## 🚧 Roadmap

- [ ] Pages stubs à compléter : `/calendar`, `/notifications`, `/personel`, `/settings`
- [ ] Tests automatisés (Jest pour NestJS, Vitest pour Next.js)
- [ ] Documentation OpenAPI/Swagger générée depuis les contrôleurs
- [ ] Logger structuré (Pino) + intégration Sentry
- [ ] Extraction des schemas Zod dans un `packages/shared` (workspaces npm) pour partage typé front ↔ back
- [ ] Pipeline CI/CD (GitHub Actions)

---

## 📜 Licence

Privé / Interne — © Skoul.
