# sloty — SaaS Appointment System

> **sloty** is a multi-tenant scheduling platform built with **Next.js**, **Prisma**, **TypeScript**, and **PostgreSQL**.  
> It scales from a one-chair barbershop to a full clinic with specialties, services, availability, and nested/conditional booking parameters.  
> Documentation powered by **Docusaurus**. Tests with **Vitest**, **Testing Library**, and **Playwright**.

## ✨ Features

- **Multi-tenant**: strict tenant isolation (per-row `tenantId`)
- **Flexible catalog**: specialties, services, provider overrides
- **Nested parameters**: conditional fields shown based on previous selections
- **Availability engine**: weekly hours, time off, closures, slot holds
- **Appointments**: participants, statuses, audits
- **Billing-ready**: products, plans, subscriptions, invoices, payments (extensible)
- **Docs**: Docusaurus site inside the repo
- **DX**: TypeScript, ESLint, Prettier, commit hooks

## 🧰 Tech Stack

- **Frontend**: Next.js (App Router) + React, TypeScript
- **DB/ORM**: PostgreSQL + Prisma
- **Docs**: Docusaurus 3
- **Testing**: Vitest (unit), @testing-library/react (component), Playwright (e2e)
- **Tooling**: ESLint, Prettier, Husky, lint-staged
- **Auth**: (stubbed) — pluggable auth provider (NextAuth or custom)

---

## 📁 Monorepo Layout

```
sloty-saas-appointment-system/
├─ apps/
│  ├─ web/                 # Next.js app (App Router, /app)
│  └─ docs/                # Docusaurus
├─ prisma/
│  ├─ schema.prisma        # Data model
│  └─ seed.ts              # Seed script
├─ packages/
│  └─ config/              # shared ESLint/tsconfig/etc (optional)
├─ .env.example
├─ docker-compose.yaml     # local Postgres
├─ package.json
└─ README.md
```

---

## 🚀 Getting Started

### 1) Requirements

- Node.js 18+ (LTS recommended)
- PNPM (recommended) or npm/yarn
- Docker (for local Postgres)  
  _or_ an external Postgres URL

### 2) Clone & Install

```bash
git clone https://github.com/your-org/sloty-saas-appointment-system.git
cd sloty-saas-appointment-system
pnpm install
```

### 3) Environment Variables

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

**`.env.example`**

```
# Database
DATABASE_URL="postgresql://sloty:sloty@localhost:5432/sloty?schema=public"

# Next.js
NEXT_PUBLIC_APP_NAME="sloty"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-strong-secret"

# Optional external billing providers (Stripe, etc.)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

### 4) Start Postgres (Docker)

```bash
docker compose up -d
```

`docker-compose.yaml` provisions a local Postgres with user/password `sloty/sloty`.

### 5) Prisma: Migrate & Seed

```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

### 6) Run the App

```bash
pnpm dev
```

- Web: http://localhost:3000  
- Docs: http://localhost:3100 (see below)

---

## 📚 Documentation (Docusaurus)

```bash
pnpm docs:dev
```

This serves the docs from `apps/docs`.  
Build & deploy docs:

```bash
pnpm docs:build
pnpm docs:serve  # to preview the static build locally
```

---

## 🧪 Testing

- **Unit/Component**: Vitest + Testing Library
- **E2E**: Playwright

```bash
# Unit & component tests
pnpm test

# E2E (make sure the app is running on :3000)
pnpm e2e
```

---

## 🗄 Prisma Schema (excerpt)

> Full model in `prisma/schema.prisma`. Here’s a shortened preview of core entities.

```prisma
model Tenant {
  id              String   @id @default(cuid())
  name            String
  timezone        String
  defaultCurrency String   @default("USD")
  status          String   @default("active")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  users       User[]
  locations   Location[]
  persons     Person[]
  services    Service[]
  specialties Specialty[]
}
...
```
_(excerpt continues in the repo)_

---

## 🧪 Example Test Commands

```bash
# Unit/Component
pnpm test                 # vitest

# E2E
pnpm dev & pnpm e2e       # starts dev server and runs Playwright
```

---

## 🧱 Useful Scripts

`package.json` includes:

```json
{
  "scripts": {
    "dev": "pnpm -C apps/web dev",
    "build": "pnpm -C apps/web build",
    "start": "pnpm -C apps/web start",

    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node --transpile-only prisma/seed.ts",

    "docs:dev": "pnpm -C apps/docs start",
    "docs:build": "pnpm -C apps/docs build",
    "docs:serve": "pnpm -C apps/docs serve",

    "test": "vitest",
    "e2e": "playwright test",
    "lint": "eslint .",
    "format": "prettier -w ."
  }
}
```

---

## ☁️ Deployment

- **Frontend**: Vercel / Netlify / Docker
- **Database**: Neon / Supabase / Render / RDS
- **Migrations**: `pnpm prisma:deploy` on startup
- **Env**: set `DATABASE_URL`, `NEXTAUTH_*`, and any provider keys

---

## 🔐 Security & Multitenancy

- Every model has a `tenantId`
- Always filter by tenant in server actions/routers
- Consider Row-Level Security (RLS) if you ever move to a DB that supports it well for Prisma (or enforce at application layer)

---

## 📄 License

MIT © You
