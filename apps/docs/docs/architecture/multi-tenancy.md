---
sidebar_position: 4
---

# Multi-Tenancy

Sloty implements a robust multi-tenant architecture ensuring complete data isolation and security between different organizations.

## Multi-Tenancy Strategy

### Approach: Row-Level Security (RLS)

Sloty uses **Row-Level Security** with tenant ID filtering at the database level:

- ✅ **Simple to implement and understand**
- ✅ **Cost-effective** - single database for all tenants
- ✅ **Easy to backup and maintain**
- ✅ **Efficient resource utilization**
- ✅ **Good performance** with proper indexing

```mermaid
graph TD
    subgraph "Multi-Tenant Database"
        T1[Tenant A Data]
        T2[Tenant B Data]
        T3[Tenant C Data]
    end
    
    subgraph "Application Layer"
        APP[Next.js Apps]
        API[API Routes]
        MIDDLEWARE[Tenant Middleware]
    end
    
    subgraph "Tenant Resolution"
        SUBDOMAIN[subdomain.sloty.app]
        DOMAIN[custom-domain.com]
        PATH[/tenant/slug]
    end
    
    SUBDOMAIN --> MIDDLEWARE
    DOMAIN --> MIDDLEWARE
    PATH --> MIDDLEWARE
    
    MIDDLEWARE --> APP
    APP --> API
    API --> T1
    API --> T2
    API --> T3
```

## Tenant Resolution

### Multiple Resolution Methods

Sloty supports multiple tenant resolution strategies:

#### 1. Subdomain Resolution
```
https://acme-clinic.sloty.app
```

#### 2. Custom Domain Resolution
```
https://appointments.acmeclinic.com
```

#### 3. Path-based Resolution
```
https://sloty.app/acme-clinic
```

### Implementation

```typescript
// middleware.ts - Tenant resolution middleware
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@repo/db'

export async function middleware(request: NextRequest) {
  const tenant = await resolveTenant(request)
  
  if (!tenant) {
    return NextResponse.redirect('/tenant-not-found')
  }
  
  // Add tenant to request headers
  const response = NextResponse.next()
  response.headers.set('x-tenant-id', tenant.id)
  response.headers.set('x-tenant-slug', tenant.slug)
  
  return response
}

async function resolveTenant(request: NextRequest) {
  const host = request.headers.get('host')
  const pathname = request.nextUrl.pathname
  
  // 1. Try subdomain resolution
  if (host && host !== 'sloty.app') {
    const subdomain = host.split('.')[0]
    const tenant = await db.tenant.findUnique({
      where: { slug: subdomain }
    })
    if (tenant) return tenant
  }
  
  // 2. Try custom domain resolution
  if (host) {
    const tenant = await db.tenant.findUnique({
      where: { domain: host }
    })
    if (tenant) return tenant
  }
  
  // 3. Try path-based resolution
  const pathSegments = pathname.split('/')
  if (pathSegments.length > 1) {
    const slug = pathSegments[1]
    const tenant = await db.tenant.findUnique({
      where: { slug }
    })
    if (tenant) return tenant
  }
  
  return null
}
```

## Data Isolation

### Database Schema Design

Every tenant-specific table includes a `tenantId` column:

```prisma
model Appointment {
  id        String   @id @default(cuid())
  // ... other fields
  
  // Multi-tenancy - REQUIRED on all tenant tables
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@index([tenantId])
}
```

### Query Patterns

All database queries MUST include tenant filtering:

```typescript
// ✅ Correct - Tenant-aware query
export async function getAppointments(tenantId: string, providerId?: string) {
  return await db.appointment.findMany({
    where: {
      tenantId, // Always include tenant filter
      ...(providerId && { providerId }),
    },
    include: {
      customer: true,
      service: true,
      provider: true,
    },
  })
}

// ❌ Incorrect - Missing tenant filter (SECURITY RISK)
export async function getAppointments(providerId?: string) {
  return await db.appointment.findMany({
    where: {
      ...(providerId && { providerId }),
    },
  })
}
```

### API Security

All API routes enforce tenant context:

```typescript
// app/api/appointments/route.ts
import { NextRequest } from 'next/server'
import { requireAuth } from '@repo/auth'
import { db } from '@repo/db'

export async function GET(request: NextRequest) {
  // 1. Authenticate user
  const session = await requireAuth(request)
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 2. Get tenant from session
  const tenantId = session.user.tenantId
  
  // 3. Query with tenant filter
  const appointments = await db.appointment.findMany({
    where: {
      tenantId, // Tenant isolation enforced
    },
  })
  
  return Response.json(appointments)
}
```

## Tenant Management

### Tenant Creation

```typescript
// Tenant registration flow
export async function createTenant(data: {
  name: string
  slug: string
  adminEmail: string
  adminName: string
}) {
  return await db.$transaction(async (tx) => {
    // 1. Create tenant
    const tenant = await tx.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        status: 'ACTIVE',
        subscriptionTier: 'FREE',
        subscriptionStatus: 'TRIAL',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      },
    })
    
    // 2. Create admin user
    const user = await tx.user.create({
      data: {
        email: data.adminEmail,
        name: data.adminName,
        tenantId: tenant.id,
        role: 'TENANT_ADMIN',
      },
    })
    
    // 3. Create default location
    await tx.location.create({
      data: {
        name: 'Main Location',
        address: '',
        city: '',
        country: 'US',
        tenantId: tenant.id,
      },
    })
    
    return { tenant, user }
  })
}
```

### Tenant Settings

```prisma
model Tenant {
  id       String @id @default(cuid())
  name     String
  slug     String @unique
  domain   String? @unique
  
  // Flexible settings as JSON
  settings Json   @default("{}")
  
  // Settings might include:
  // {
  //   "branding": {
  //     "primaryColor": "#3b82f6",
  //     "logo": "https://cdn.example.com/logo.png",
  //     "favicon": "https://cdn.example.com/favicon.ico"
  //   },
  //   "booking": {
  //     "allowCancellation": true,
  //     "cancellationWindow": 24,
  //     "requireConfirmation": false,
  //     "defaultDuration": 30
  //   },
  //   "notifications": {
  //     "emailReminders": true,
  //     "smsReminders": false,
  //     "reminderTimes": [24, 2]
  //   },
  //   "business": {
  //     "timezone": "America/New_York",
  //     "currency": "USD",
  //     "dateFormat": "MM/dd/yyyy",
  //     "timeFormat": "12h"
  //   }
  // }
}
```

## Multi-Tenant Features

### Branding & Customization

Each tenant can customize their booking experience:

```typescript
// app/[tenant]/layout.tsx
import { resolveTenant } from '@/lib/tenant'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { tenant: string } }) {
  const tenant = await resolveTenant(params.tenant)
  if (!tenant) notFound()
  
  const settings = tenant.settings as TenantSettings
  
  return {
    title: `Book with ${tenant.name}`,
    description: `Schedule your appointment with ${tenant.name}`,
    icons: {
      icon: settings.branding?.favicon || '/favicon.ico',
    },
  }
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenant: string }
}) {
  const tenant = await resolveTenant(params.tenant)
  if (!tenant) notFound()
  
  const settings = tenant.settings as TenantSettings
  
  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary-color: ${settings.branding?.primaryColor || '#3b82f6'};
            }
          `
        }} />
      </head>
      <body>
        <TenantProvider tenant={tenant}>
          {children}
        </TenantProvider>
      </body>
    </html>
  )
}
```

### Per-Tenant Configuration

```typescript
// hooks/useTenantSettings.ts
import { useContext } from 'react'
import { TenantContext } from '@/providers/TenantProvider'

export function useTenantSettings() {
  const tenant = useContext(TenantContext)
  if (!tenant) throw new Error('useTenantSettings must be used within TenantProvider')
  
  const settings = tenant.settings as TenantSettings
  
  return {
    branding: settings.branding || {},
    booking: settings.booking || {},
    notifications: settings.notifications || {},
    business: settings.business || {},
  }
}

// Usage in components
function BookingForm() {
  const { booking, business } = useTenantSettings()
  
  return (
    <form>
      <DatePicker
        format={business.dateFormat || 'MM/dd/yyyy'}
        allowPastDates={false}
        minAdvanceDays={booking.minAdvanceDays || 0}
      />
    </form>
  )
}
```

## Performance Optimization

### Database Indexing

Proper indexing is crucial for multi-tenant performance:

```sql
-- Composite indexes for tenant + commonly queried fields
CREATE INDEX idx_appointments_tenant_provider_date 
ON appointments(tenant_id, provider_id, start_time);

CREATE INDEX idx_customers_tenant_email 
ON customers(tenant_id, email);

CREATE INDEX idx_services_tenant_active 
ON services(tenant_id, is_active);

-- Unique constraints that include tenant_id
CREATE UNIQUE INDEX idx_customers_email_tenant 
ON customers(email, tenant_id);

CREATE UNIQUE INDEX idx_providers_user_tenant 
ON providers(user_id, tenant_id);
```

### Query Optimization

```typescript
// Use selective loading for large datasets
export async function getAppointmentsByMonth(
  tenantId: string,
  providerId: string,
  year: number,
  month: number
) {
  const startOfMonth = new Date(year, month - 1, 1)
  const endOfMonth = new Date(year, month, 0, 23, 59, 59)
  
  return await db.appointment.findMany({
    where: {
      tenantId,
      providerId,
      startTime: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      service: {
        select: {
          name: true,
          duration: true,
        },
      },
      customer: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  })
}
```

### Caching Strategies

```typescript
// Redis caching for tenant settings
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function getTenantSettings(tenantId: string) {
  // Try cache first
  const cached = await redis.get(`tenant:${tenantId}:settings`)
  if (cached) {
    return cached as TenantSettings
  }
  
  // Fetch from database
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    select: { settings: true },
  })
  
  if (tenant) {
    // Cache for 5 minutes
    await redis.setex(`tenant:${tenantId}:settings`, 300, tenant.settings)
    return tenant.settings as TenantSettings
  }
  
  return null
}
```

## Security Considerations

### Access Control

```typescript
// lib/auth/permissions.ts
export function canAccessTenant(user: User, tenantId: string): boolean {
  // Superadmin can access any tenant
  if (user.role === 'SUPER_ADMIN') {
    return true
  }
  
  // Regular users can only access their tenant
  return user.tenantId === tenantId
}

export function requireTenantAccess(user: User, tenantId: string) {
  if (!canAccessTenant(user, tenantId)) {
    throw new Error('Insufficient permissions')
  }
}

// Usage in API routes
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  const session = await requireAuth(request)
  requireTenantAccess(session.user, params.tenantId)
  
  // Safe to proceed with tenant data
}
```

### Input Validation

```typescript
// lib/validation/tenant.ts
import { z } from 'zod'

export const TenantCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens')
    .refine(slug => !['api', 'www', 'admin', 'app'].includes(slug), 
            'Reserved slug'),
})

// Validate tenant slug availability
export async function validateTenantSlug(slug: string) {
  const existing = await db.tenant.findUnique({
    where: { slug },
  })
  
  return !existing
}
```

### Data Export/Import

```typescript
// lib/tenant/export.ts
export async function exportTenantData(tenantId: string) {
  const data = await db.$transaction(async (tx) => {
    const [appointments, customers, services, providers] = await Promise.all([
      tx.appointment.findMany({ where: { tenantId } }),
      tx.customer.findMany({ where: { tenantId } }),
      tx.service.findMany({ where: { tenantId } }),
      tx.provider.findMany({ where: { tenantId } }),
    ])
    
    return {
      appointments,
      customers,
      services,
      providers,
      exportedAt: new Date().toISOString(),
    }
  })
  
  return data
}
```

## Tenant Isolation Testing

### Test Suite

```typescript
// __tests__/tenant-isolation.test.ts
import { db } from '@repo/db'
import { createTestTenant, createTestUser } from '../helpers/test-utils'

describe('Tenant Isolation', () => {
  it('should not return data from other tenants', async () => {
    // Create two separate tenants
    const tenant1 = await createTestTenant('tenant-1')
    const tenant2 = await createTestTenant('tenant-2')
    
    // Create data for each tenant
    const appointment1 = await db.appointment.create({
      data: {
        tenantId: tenant1.id,
        // ... other required fields
      },
    })
    
    const appointment2 = await db.appointment.create({
      data: {
        tenantId: tenant2.id,
        // ... other required fields
      },
    })
    
    // Query should only return tenant1 data
    const tenant1Appointments = await db.appointment.findMany({
      where: { tenantId: tenant1.id },
    })
    
    expect(tenant1Appointments).toHaveLength(1)
    expect(tenant1Appointments[0].id).toBe(appointment1.id)
    expect(tenant1Appointments[0].id).not.toBe(appointment2.id)
  })
  
  it('should enforce tenant boundaries in API routes', async () => {
    // Test API route isolation
    const tenant1User = await createTestUser(tenant1.id)
    const response = await request(app)
      .get(`/api/tenants/${tenant2.id}/appointments`)
      .set('Authorization', `Bearer ${tenant1User.token}`)
      .expect(403) // Forbidden
  })
})
```

## Monitoring & Analytics

### Tenant Metrics

```typescript
// lib/analytics/tenant-metrics.ts
export async function getTenantMetrics(tenantId: string, period: string) {
  const startDate = getPeriodStart(period)
  
  const [appointmentCount, customerCount, revenue] = await Promise.all([
    db.appointment.count({
      where: {
        tenantId,
        createdAt: { gte: startDate },
        status: { in: ['COMPLETED', 'CONFIRMED'] },
      },
    }),
    
    db.customer.count({
      where: {
        tenantId,
        createdAt: { gte: startDate },
      },
    }),
    
    db.appointment.aggregate({
      where: {
        tenantId,
        createdAt: { gte: startDate },
        status: 'COMPLETED',
      },
      _sum: {
        // If you have a price field
        price: true,
      },
    }),
  ])
  
  return {
    appointments: appointmentCount,
    customers: customerCount,
    revenue: revenue._sum.price || 0,
  }
}
```

---

Continue exploring the core concepts in [Authentication](/docs/core-concepts/authentication).
