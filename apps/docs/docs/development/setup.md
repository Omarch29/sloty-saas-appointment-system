---
sidebar_position: 1
---

# Development Setup

Complete guide for setting up your development environment and contributing to Sloty.

## Prerequisites

### System Requirements

- **Node.js**: Version 18.0.0 or higher
- **pnpm**: Package manager (recommended) or npm
- **PostgreSQL**: Version 14 or higher
- **Git**: Version control
- **VS Code**: Recommended IDE with extensions

### Recommended VS Code Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-playwright.playwright",
    "vitest.explorer"
  ]
}
```

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/Omarch29/sloty-saas-appointment-system.git
cd sloty-saas-appointment-system
```

### 2. Install Dependencies

```bash
# Install pnpm globally (if not installed)
npm install -g pnpm

# Install project dependencies
pnpm install
```

### 3. Environment Setup

Create environment files for each application:

```bash
# Root environment
cp .env.example .env

# Application-specific environments
cp apps/backoffice/.env.example apps/backoffice/.env.local
cp apps/tenant/.env.example apps/tenant/.env.local
cp apps/booking/.env.example apps/booking/.env.local
```

### 4. Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker run -d \
  --name sloty-postgres \
  -e POSTGRES_DB=sloty_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Run database migrations
pnpm prisma:migrate

# Generate Prisma client
pnpm prisma:generate

# Seed development data
pnpm prisma:seed
```

### 5. Start Development Servers

```bash
# Start all applications
pnpm dev

# Or start individual applications
pnpm dev:backoffice  # Port 3000
pnpm dev:tenant      # Port 3001
pnpm dev:booking     # Port 3002
```

### 6. Verify Setup

Visit these URLs to confirm everything is working:

- **Backoffice**: http://localhost:3000
- **Tenant Dashboard**: http://localhost:3001
- **Booking Interface**: http://localhost:3002/demo-clinic
- **Documentation**: `pnpm docs:dev` → http://localhost:3100

## Development Workflow

### Branch Strategy

We use Git Flow for branch management:

```bash
main              # Production-ready code
├── develop       # Integration branch
├── feature/*     # Feature branches
├── release/*     # Release branches
└── hotfix/*      # Emergency fixes
```

### Creating a Feature Branch

```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/appointment-reminders

# Work on your feature...
git add .
git commit -m "feat: add email reminder functionality"

# Push and create PR
git push origin feature/appointment-reminders
```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>[optional scope]: <description>

# Examples
feat(booking): add appointment cancellation
fix(auth): resolve session timeout issue
docs(api): update appointment endpoints
test(appointments): add booking flow tests
refactor(ui): simplify button components
```

**Types**:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## Code Standards

### TypeScript Configuration

The project uses strict TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noImplicitAny": true
  }
}
```

### ESLint Configuration

Code quality is enforced with ESLint:

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-return-type': 'warn',
    'prefer-const': 'error'
  }
}
```

### Prettier Configuration

Consistent formatting with Prettier:

```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}
```

### Import Organization

Organize imports in this order:

```typescript
// 1. React imports
import React, { useState, useEffect } from 'react'

// 2. Third-party imports
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'

// 3. Internal shared packages
import { Button } from '@repo/ui'
import { db } from '@repo/db'

// 4. Relative imports
import { AppointmentForm } from '../components/AppointmentForm'
import { useAppointments } from '../hooks/useAppointments'
import type { Appointment } from '../types'
```

## Testing Strategy

### Unit Tests

Run unit tests with Vitest:

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Test coverage
pnpm test:coverage

# UI mode
pnpm test:ui
```

### Test Structure

```typescript
// __tests__/appointment.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { createAppointment } from '@/lib/appointments'

describe('Appointment Creation', () => {
  beforeEach(() => {
    // Setup test database
  })

  it('should create appointment with valid data', async () => {
    const appointment = await createAppointment({
      customerId: 'customer_123',
      serviceId: 'service_456',
      providerId: 'provider_789',
      startTime: new Date('2024-01-20T14:00:00Z'),
    })

    expect(appointment).toBeTruthy()
    expect(appointment.status).toBe('SCHEDULED')
  })

  it('should validate required fields', async () => {
    await expect(createAppointment({})).rejects.toThrow('Missing required fields')
  })
})
```

### End-to-End Tests

Run E2E tests with Playwright:

```bash
# Run E2E tests
pnpm e2e

# Run with UI
pnpm e2e:ui

# Run in headed mode
pnpm e2e:headed
```

### E2E Test Example

```typescript
// e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test'

test('complete booking flow', async ({ page }) => {
  // Navigate to booking page
  await page.goto('/demo-clinic')
  
  // Select service
  await page.click('[data-testid="service-general-consultation"]')
  
  // Choose provider
  await page.click('[data-testid="provider-dr-smith"]')
  
  // Select date and time
  await page.click('[data-testid="date-picker"]')
  await page.click('[data-testid="slot-14:00"]')
  
  // Fill customer information
  await page.fill('[data-testid="customer-name"]', 'John Doe')
  await page.fill('[data-testid="customer-email"]', 'john@example.com')
  await page.fill('[data-testid="customer-phone"]', '+1234567890')
  
  // Submit booking
  await page.click('[data-testid="confirm-booking"]')
  
  // Verify success
  await expect(page.locator('[data-testid="booking-success"]')).toBeVisible()
})
```

## Database Development

### Schema Changes

1. **Modify** `prisma/schema.prisma`
2. **Create Migration**: `pnpm prisma migrate dev --name your-change`
3. **Generate Client**: `pnpm prisma generate`
4. **Update Seed Data**: Modify `prisma/seed.ts` if needed

### Database Utilities

```bash
# Database management commands
pnpm prisma:studio      # Visual database editor
pnpm prisma:migrate     # Run migrations
pnpm prisma:generate    # Generate client
pnpm prisma:seed        # Seed development data
pnpm prisma:reset       # Reset database (destructive)
```

### Adding New Models

```prisma
// Example: Adding a new model
model Notification {
  id        String   @id @default(cuid())
  type      NotificationType
  title     String
  message   String
  read      Boolean  @default(false)
  
  // Multi-tenancy
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  
  // User relationship
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([tenantId])
  @@index([userId])
}

enum NotificationType {
  APPOINTMENT_REMINDER
  APPOINTMENT_CONFIRMED
  APPOINTMENT_CANCELLED
  SYSTEM_NOTIFICATION
}
```

## Component Development

### Component Structure

```typescript
// components/AppointmentCard.tsx
interface AppointmentCardProps {
  appointment: Appointment
  onEdit?: (appointment: Appointment) => void
  onCancel?: (appointment: Appointment) => void
  className?: string
}

export function AppointmentCard({ 
  appointment, 
  onEdit, 
  onCancel, 
  className 
}: AppointmentCardProps) {
  return (
    <div 
      className={cn("p-4 border rounded-lg", className)}
      data-testid="appointment-card"
    >
      <h3 className="font-semibold">{appointment.service.name}</h3>
      <p className="text-sm text-gray-600">
        {format(appointment.startTime, 'PPp')}
      </p>
      
      <div className="mt-2 space-x-2">
        {onEdit && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(appointment)}
          >
            Edit
          </Button>
        )}
        
        {onCancel && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onCancel(appointment)}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}
```

### Storybook for Components

Add stories for components:

```typescript
// components/AppointmentCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { AppointmentCard } from './AppointmentCard'

const meta: Meta<typeof AppointmentCard> = {
  title: 'Components/AppointmentCard',
  component: AppointmentCard,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    appointment: {
      id: '1',
      service: { name: 'General Consultation' },
      startTime: new Date('2024-01-20T14:00:00Z'),
      customer: { name: 'John Doe' },
      status: 'CONFIRMED',
    },
  },
}

export const WithActions: Story = {
  args: {
    ...Default.args,
    onEdit: (appointment) => console.log('Edit:', appointment),
    onCancel: (appointment) => console.log('Cancel:', appointment),
  },
}
```

## API Development

### Creating API Routes

```typescript
// app/api/appointments/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@repo/db'
import { requireAuth } from '@repo/auth'

const createAppointmentSchema = z.object({
  customerId: z.string(),
  serviceId: z.string(),
  providerId: z.string(),
  startTime: z.string().datetime(),
  parameters: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const session = await requireAuth(request)
    
    // Parse request body
    const body = await request.json()
    const data = createAppointmentSchema.parse(body)
    
    // Business logic
    const appointment = await db.appointment.create({
      data: {
        ...data,
        tenantId: session.user.tenantId,
        status: 'SCHEDULED',
      },
      include: {
        customer: true,
        service: true,
        provider: true,
      },
    })
    
    // Send confirmation email
    await sendAppointmentConfirmation(appointment)
    
    return Response.json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors,
        },
      }, { status: 400 })
    }
    
    console.error('API Error:', error)
    return Response.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An internal error occurred',
      },
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await requireAuth(request)
  const { searchParams } = new URL(request.url)
  
  const appointments = await db.appointment.findMany({
    where: {
      tenantId: session.user.tenantId,
      // Add filters based on query params
    },
    include: {
      customer: true,
      service: true,
      provider: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  })
  
  return Response.json({
    success: true,
    data: appointments,
  })
}
```

### API Testing

```typescript
// __tests__/api/appointments.test.ts
import { describe, it, expect } from 'vitest'
import { POST } from '@/app/api/appointments/route'

describe('/api/appointments', () => {
  it('should create appointment', async () => {
    const request = new Request('http://localhost/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: 'customer_123',
        serviceId: 'service_456',
        providerId: 'provider_789',
        startTime: '2024-01-20T14:00:00Z',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toBeTruthy()
  })
})
```

## Performance Optimization

### Bundle Analysis

Analyze bundle sizes:

```bash
# Analyze Next.js bundles
pnpm build
pnpm analyze

# View bundle analyzer report
open .next/analyze/client.html
```

### Database Query Optimization

```typescript
// Efficient query with proper indexing
const appointments = await db.appointment.findMany({
  where: {
    tenantId,           // Indexed
    providerId,         // Indexed  
    startTime: {        // Composite index
      gte: startDate,
      lte: endDate,
    },
  },
  select: {
    // Select only needed fields
    id: true,
    startTime: true,
    endTime: true,
    status: true,
    customer: {
      select: {
        name: true,
        email: true,
      },
    },
  },
  orderBy: {
    startTime: 'asc',
  },
  take: 50, // Limit results
})
```

### Caching Strategies

```typescript
// React Query for client-side caching
export function useAppointments(providerId: string, date: string) {
  return useQuery({
    queryKey: ['appointments', providerId, date],
    queryFn: () => fetchAppointments(providerId, date),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Server-side caching with Redis
export async function getCachedTenantSettings(tenantId: string) {
  const cached = await redis.get(`tenant:${tenantId}:settings`)
  if (cached) return JSON.parse(cached)
  
  const settings = await db.tenant.findUnique({
    where: { id: tenantId },
    select: { settings: true },
  })
  
  if (settings) {
    await redis.setex(`tenant:${tenantId}:settings`, 300, JSON.stringify(settings))
  }
  
  return settings
}
```

## Debugging

### VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/apps/tenant",
      "console": "integratedTerminal",
      "env": {
        "NODE_OPTIONS": "--inspect"
      }
    }
  ]
}
```

### Logging

```typescript
// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: process.env.NODE_ENV === 'development' 
    ? { target: 'pino-pretty' }
    : undefined,
})

// Usage
logger.info({ userId: '123', action: 'login' }, 'User logged in')
logger.error({ error: error.message }, 'Failed to create appointment')
```

### Database Debugging

```typescript
// Enable Prisma query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Custom middleware for query timing
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
  return result
})
```

## Contributing

### Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new functionality
5. **Run** tests and linting
6. **Submit** pull request

### PR Checklist

- [ ] Tests pass (`pnpm test`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] TypeScript compiles (`pnpm type-check`)
- [ ] E2E tests pass (`pnpm e2e`)
- [ ] Documentation updated
- [ ] Changeset added (if needed)

### Code Review Guidelines

**For Authors**:
- Keep PRs small and focused
- Write clear commit messages
- Add tests for new features
- Update documentation

**For Reviewers**:
- Check for security issues
- Verify test coverage
- Test functionality manually
- Provide constructive feedback

---

Happy coding! 🚀 For questions, check our [Troubleshooting Guide](/docs/development/troubleshooting) or open an issue on GitHub.
