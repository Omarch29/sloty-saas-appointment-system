# Sloty — Multi-Tenant SaaS Appointment System

> **Sloty** is a comprehensive multi-tenant scheduling platform built with **Next.js**, **Prisma**, **TypeScript**, and **PostgreSQL**.  
> It scales from a single provider practice to enterprise healthcare systems with specialties, services, complex availability rules, and nested/conditional booking parameters.  
> Built as a **monorepo** with three dedicated applications, shared packages, and comprehensive documentation.

## ✨ Features

- **🏢 Multi-tenant Architecture**: Complete tenant isolation with per-row `tenantId` security
- **🔐 Role-based Access Control**: Superadmin, tenant admin, staff, and customer roles
- **🏥 Healthcare-Ready**: Providers, specialties, services, locations, and resources
- **📋 Flexible Parameters**: Nested/conditional form fields based on service selections
- **⏰ Advanced Scheduling**: Working hours, time off, location closures, booking holds
- **📊 Comprehensive Billing**: Products, plans, subscriptions, invoices, and payments
- **🎨 Shared UI Components**: Consistent design system across all applications
- **📚 Built-in Documentation**: Docusaurus-powered docs with live examples
- **🧪 Full Test Coverage**: Unit, integration, and e2e testing with modern tooling

## 🏗️ Architecture

### Monorepo Structure

This project follows a **monorepo architecture** with dedicated applications and shared packages:

```
sloty-saas-appointment-system/
├── apps/                           # Applications
│   ├── backoffice/                # Superadmin UI (port 3000)
│   │   ├── src/app/               # Next.js App Router
│   │   ├── package.json
│   │   └── tailwind.config.ts
│   ├── tenant/                    # Tenant Backoffice (port 3001)
│   │   ├── src/app/               # Tenant management interface
│   │   └── middleware.ts          # Tenant resolution
│   ├── booking/                   # Customer Booking UI (port 3002)
│   │   ├── src/app/               # Public booking interface
│   │   └── middleware.ts          # Rate limiting & tenant resolution
│   └── docs/                      # Docusaurus documentation
├── packages/                      # Shared packages
│   ├── ui/                        # Shared UI components
│   │   ├── src/components/        # Button, Card, Form, Modal
│   │   ├── tailwind.config.ts     # Design system
│   │   └── package.json
│   ├── db/                        # Database client & utilities
│   │   ├── src/index.ts           # Prisma client + tenant helpers
│   │   └── package.json
│   ├── auth/                      # Authentication & authorization
│   │   ├── src/index.ts           # NextAuth config + RBAC
│   │   └── package.json
│   └── config/                    # Shared configuration
│       ├── tailwind.config.js     # Base Tailwind config
│       └── eslint.config.js       # ESLint rules
├── prisma/
│   ├── schema.prisma              # 40+ models, comprehensive data model
│   ├── seed.ts                    # Demo data with dependency rules
│   └── migrations/                # Database migrations
├── .env.example                   # Environment template
├── docker-compose.yaml            # PostgreSQL + pgAdmin
└── package.json                   # Workspace orchestration
```

### Application Roles

| App | Purpose | Port | Users |
|-----|---------|------|-------|
| **Backoffice** | System administration, tenant management, global settings | 3000 | Superadmins |
| **Tenant** | Practice management, providers, appointments, billing | 3001 | Clinic owners, staff |
| **Booking** | Patient-facing booking interface | 3002 | Patients, customers |

## 🧰 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5
- **Database**: PostgreSQL 16 + Prisma ORM 5
- **UI/Styling**: Tailwind CSS 4, shadcn/ui components
- **Authentication**: NextAuth.js with credentials + RBAC
- **Documentation**: Docusaurus 3
- **Testing**: Vitest (unit), Testing Library (components), Playwright (e2e)
- **Tooling**: ESLint 9, Prettier, Husky, lint-staged
- **Build**: tsup for packages, native Next.js for apps
- **Container**: Docker Compose for local development

---

## � Getting Started

### Prerequisites

- **Node.js**: >= 20.17.0 or >= 22.9.0
- **Package Manager**: npm (recommended) or pnpm
- **Database**: Docker & Docker Compose (for local PostgreSQL)

### 1. Clone & Install

```bash
git clone <repository-url>
cd sloty-saas-appointment-system
npm install
```

### 2. Database Setup

```bash
# Start PostgreSQL with Docker
docker compose up -d

# Copy environment variables
cp .env.example .env

# Run migrations and seed data
npm run prisma:migrate
npm run prisma:seed
```

### 3. Build Shared Packages

```bash
# Build all shared packages
npm run build:packages

# Or build individually
cd packages/ui && npm run build
cd packages/db && npm run build
```

### 4. Start Development

```bash
# Start all apps simultaneously
npm run dev

# Or start individually
npm run dev:backoffice  # http://localhost:3000
npm run dev:tenant      # http://localhost:3001  
npm run dev:booking     # http://localhost:3002
```

---

## 📦 Package Development

### Shared Packages

The monorepo uses shared packages to maintain consistency and avoid duplication:

#### `@sloty/ui`
- **Purpose**: Shared React components with consistent styling
- **Components**: Button, Card, Form, Modal, Typography
- **Features**: Tailwind CSS, TypeScript, Tree-shaking support
- **Build**: `cd packages/ui && npm run build`

#### `@sloty/db`
- **Purpose**: Centralized database client with tenant-guarded operations
- **Features**: Prisma client singleton, tenant-scoped queries, type safety
- **Usage**: `createTenantClient(tenantId)` for multi-tenant operations
- **Build**: `cd packages/db && npm run build`

#### `@sloty/auth`
- **Purpose**: Authentication configuration and RBAC helpers
- **Features**: NextAuth.js setup, role-based guards, session management
- **Guards**: `requireRole('superadmin')`, `requireTenantRole(['admin', 'staff'])`
- **Build**: `cd packages/auth && npm run build`

#### `@sloty/config`
- **Purpose**: Shared configuration for Tailwind, ESLint, TypeScript
- **Features**: Base configs, environment helpers, app-specific overrides
- **Build**: `cd packages/config && npm run build`

### Package Dependencies

Applications reference packages using file paths:
```json
{
  "dependencies": {
    "@sloty/ui": "file:../../packages/ui",
    "@sloty/db": "file:../../packages/db",
    "@sloty/auth": "file:../../packages/auth",
    "@sloty/config": "file:../../packages/config"
  }
}
```

---

## 🗃️ Database Schema

### Multi-Tenant Architecture

The system uses **row-level multitenancy** with a `tenantId` column in every table:

- **Tenant Isolation**: All queries are scoped to the current tenant
- **Data Security**: No cross-tenant data leakage
- **Scalability**: Single database, multiple organizations

### Core Entities (40+ Models)

| Section | Models | Purpose |
|---------|---------|---------|
| **Tenancy** | `Tenant`, `User` | Organization and access control |
| **People** | `Person`, `Provider`, `Customer` | Healthcare providers and patients |
| **Catalog** | `Specialty`, `Service`, `Location` | Medical services and facilities |
| **Parameters** | `ParameterDefinition`, `ParameterOption` | Dynamic form fields with dependencies |
| **Scheduling** | `Appointment`, `ProviderWorkingHours` | Booking and availability |
| **Billing** | `Product`, `Subscription`, `Invoice` | SaaS billing and payments |
| **System** | `Notification`, `BookingRule` | Communication and business logic |

### Parameter System

Advanced conditional form system:
- **Dynamic Fields**: Show/hide fields based on previous selections
- **Validation Rules**: Complex conditional validation
- **Multi-Level**: Nested dependencies up to N levels deep
- **Service-Specific**: Different parameters per service

---

## 🔐 Authentication & Authorization

### Role Hierarchy

1. **Superadmin**: System-wide access, tenant management
2. **Tenant Admin**: Full access within their organization
3. **Staff**: Limited access to appointments and patients
4. **Customer**: Booking interface access only

### Implementation

```typescript
// Server-side protection
import { requireRole, requireTenantRole } from '@sloty/auth'

// Superadmin only
export async function createTenant() {
  const session = await requireRole('superadmin')()
  // ... tenant creation logic
}

// Tenant staff
export async function getAppointments(tenantId: string) {
  const session = await requireTenantRole(['admin', 'staff'])()
  // ... appointments logic
}
```

### Tenant Resolution

Multi-tenant apps resolve the tenant from:
1. **Subdomain**: `demo-clinic.localhost:3001` → `tenantId: demo-clinic`
2. **Header**: `x-tenant-id` for API calls
3. **Session**: Stored in user authentication

---

## 🚀 Deployment

### Environment Preparation

```bash
# Production environment
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/sloty"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"

# Optional: External services
STRIPE_SECRET_KEY="sk_live_..."
REDIS_URL="redis://..."
```

### Build Commands

```bash
# Build all packages and apps
npm run build

# Build specific app
npm run build:backoffice
npm run build:tenant
npm run build:booking

# Production start
npm run start:backoffice
npm run start:tenant
npm run start:booking
```

### Docker Support

```dockerfile
# Example Dockerfile for apps
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---  
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
