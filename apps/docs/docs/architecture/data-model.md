---
sidebar_position: 3
---

# Data Model

Sloty's database schema is designed for multi-tenancy, scalability, and flexibility using PostgreSQL with Prisma ORM.

## Overview

The data model supports:
- **Multi-tenant architecture** with strict tenant isolation
- **Flexible appointment parameters** for different service types
- **Complex scheduling** with provider availability and location management
- **Audit trails** for compliance and debugging
- **Scalable relationships** for growing businesses

## Entity Relationship Diagram

```mermaid
erDiagram
    TENANT ||--o{ USER : has
    TENANT ||--o{ LOCATION : owns
    TENANT ||--o{ PROVIDER : employs
    TENANT ||--o{ SERVICE : offers
    TENANT ||--o{ APPOINTMENT : manages
    TENANT ||--o{ CUSTOMER : serves
    
    USER }|--|| TENANT : belongs_to
    PROVIDER }|--|| USER : is_a
    PROVIDER }|--|| LOCATION : works_at
    
    SERVICE ||--o{ SERVICE_PARAMETER : defines
    SERVICE ||--o{ APPOINTMENT : books
    
    APPOINTMENT ||--o{ APPOINTMENT_PARTICIPANT : includes
    APPOINTMENT ||--o{ APPOINTMENT_PARAMETER : collects
    APPOINTMENT }|--|| PROVIDER : assigned_to
    APPOINTMENT }|--|| LOCATION : held_at
    APPOINTMENT }|--|| CUSTOMER : booked_by
    
    CUSTOMER ||--o{ APPOINTMENT : books
    
    PROVIDER ||--o{ PROVIDER_AVAILABILITY : has
    PROVIDER ||--o{ PROVIDER_SCHEDULE : follows
```

## Core Entities

### Tenant

The root entity for multi-tenancy. Every other entity belongs to a tenant.

```prisma
model Tenant {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  domain      String?  @unique
  status      TenantStatus @default(ACTIVE)
  settings    Json     @default("{}")
  
  // Billing information
  subscriptionTier    SubscriptionTier @default(FREE)
  subscriptionStatus  SubscriptionStatus @default(TRIAL)
  trialEndsAt        DateTime?
  billingEmail       String?
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relationships
  users       User[]
  locations   Location[]
  providers   Provider[]
  services    Service[]
  appointments Appointment[]
  customers   Customer[]
}

enum TenantStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  DELETED
}

enum SubscriptionTier {
  FREE
  BASIC
  PRO
  ENTERPRISE
}

enum SubscriptionStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELED
  PAUSED
}
```

### User

User accounts with role-based access control.

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  
  // Authentication
  emailVerified DateTime?
  password      String?   // For email/password auth
  
  // Tenant relationship
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Role and permissions
  role      UserRole @default(USER)
  permissions Json   @default("[]")
  
  // Profile information
  phone     String?
  timezone  String   @default("UTC")
  locale    String   @default("en")
  
  // Account status
  status    UserStatus @default(ACTIVE)
  lastLoginAt DateTime?
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relationships
  provider  Provider?
  accounts  Account[]
  sessions  Session[]
  
  @@index([tenantId])
  @@index([email])
}

enum UserRole {
  SUPER_ADMIN    // Platform admin
  TENANT_ADMIN   // Tenant administrator
  PROVIDER       // Service provider
  STAFF          // Staff member
  USER           // Regular user
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  PENDING_VERIFICATION
}
```

### Location

Physical locations where services are provided.

```prisma
model Location {
  id        String   @id @default(cuid())
  name      String
  
  // Address information
  address   String
  city      String
  state     String?
  zipCode   String?
  country   String   @default("US")
  
  // Contact information
  phone     String?
  email     String?
  
  // Geographic coordinates
  latitude  Float?
  longitude Float?
  
  // Business hours and settings
  businessHours Json   @default("{}")
  timezone      String @default("UTC")
  
  // Multi-tenancy
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Status
  status    LocationStatus @default(ACTIVE)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relationships
  providers     Provider[]
  appointments  Appointment[]
  
  @@index([tenantId])
}

enum LocationStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
}
```

### Provider

Service providers (doctors, therapists, etc.) who offer appointments.

```prisma
model Provider {
  id          String   @id @default(cuid())
  
  // User relationship
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Professional information
  title       String?  // Dr., PT, etc.
  specialties String[] // Array of specialties
  bio         String?
  credentials Json     @default("[]")
  
  // Location relationship
  locationId  String
  location    Location @relation(fields: [locationId], references: [id])
  
  // Multi-tenancy
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Provider settings
  settings    Json     @default("{}")
  isActive    Boolean  @default(true)
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relationships
  appointments      Appointment[]
  availability      ProviderAvailability[]
  schedules         ProviderSchedule[]
  
  @@index([tenantId])
  @@index([locationId])
}
```

### Service

Services that can be booked (appointments, consultations, etc.).

```prisma
model Service {
  id              String   @id @default(cuid())
  name            String
  description     String?
  category        String?
  
  // Scheduling settings
  duration        Int      // Duration in minutes
  bufferTime      Int      @default(0) // Buffer time between appointments
  
  // Pricing
  price           Decimal? @db.Decimal(10,2)
  currency        String   @default("USD")
  
  // Booking settings
  maxAdvanceBooking Int?   // Days in advance
  minAdvanceBooking Int    @default(0) // Minimum hours in advance
  requiresApproval  Boolean @default(false)
  
  // Availability
  isActive        Boolean  @default(true)
  isOnline        Boolean  @default(false)
  
  // Multi-tenancy
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relationships
  parameters      ServiceParameter[]
  appointments    Appointment[]
  
  @@index([tenantId])
  @@index([category])
}
```

### ServiceParameter

Dynamic parameters for services (forms, questionnaires, etc.).

```prisma
model ServiceParameter {
  id          String   @id @default(cuid())
  
  // Service relationship
  serviceId   String
  service     Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  
  // Parameter definition
  name        String   // Field name
  label       String   // Human-readable label
  type        ParameterType
  description String?
  
  // Validation rules
  required    Boolean  @default(false)
  options     Json?    // For select/radio/checkbox types
  validation  Json?    // Validation rules (min, max, pattern, etc.)
  
  // Display settings
  order       Int      @default(0)
  group       String?  // Group related parameters
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([serviceId])
  @@unique([serviceId, name])
}

enum ParameterType {
  TEXT
  NUMBER
  EMAIL
  PHONE
  DATE
  TIME
  DATETIME
  BOOLEAN
  SELECT
  MULTISELECT
  RADIO
  CHECKBOX
  TEXTAREA
  FILE
  URL
}
```

### Customer

Customers who book appointments.

```prisma
model Customer {
  id          String   @id @default(cuid())
  
  // Basic information
  firstName   String
  lastName    String
  email       String
  phone       String?
  
  // Additional information
  dateOfBirth DateTime?
  gender      String?
  address     Json?    // Flexible address structure
  
  // Preferences
  timezone    String   @default("UTC")
  locale      String   @default("en")
  preferences Json     @default("{}")
  
  // Multi-tenancy
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relationships
  appointments Appointment[]
  
  @@index([tenantId])
  @@index([email, tenantId])
  @@unique([email, tenantId])
}
```

## Appointment System

### Appointment

The core appointment entity.

```prisma
model Appointment {
  id              String   @id @default(cuid())
  
  // Basic information
  title           String?
  notes           String?
  internalNotes   String?  // Staff-only notes
  
  // Scheduling
  startTime       DateTime
  endTime         DateTime
  timezone        String
  
  // Relationships
  serviceId       String
  service         Service  @relation(fields: [serviceId], references: [id])
  
  providerId      String
  provider        Provider @relation(fields: [providerId], references: [id])
  
  locationId      String
  location        Location @relation(fields: [locationId], references: [id])
  
  customerId      String
  customer        Customer @relation(fields: [customerId], references: [id])
  
  // Multi-tenancy
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Status and workflow
  status          AppointmentStatus @default(SCHEDULED)
  cancellationReason String?
  
  // Booking information
  bookedAt        DateTime @default(now())
  bookedBy        String?  // User ID who booked
  confirmationCode String  @unique @default(cuid())
  
  // Reminders and notifications
  remindersSent   Int      @default(0)
  lastReminderAt  DateTime?
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relationships
  participants    AppointmentParticipant[]
  parameters      AppointmentParameter[]
  
  @@index([tenantId])
  @@index([providerId])
  @@index([customerId])
  @@index([startTime])
  @@index([status])
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  CHECKED_IN
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
  RESCHEDULED
}
```

### AppointmentParameter

Collected parameter values for appointments.

```prisma
model AppointmentParameter {
  id            String   @id @default(cuid())
  
  // Appointment relationship
  appointmentId String
  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  
  // Parameter information
  parameterName String   // Reference to ServiceParameter.name
  label         String   // Snapshot of label at booking time
  value         Json     // Flexible value storage
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([appointmentId])
  @@unique([appointmentId, parameterName])
}
```

### AppointmentParticipant

Additional participants in appointments (for group sessions, family appointments, etc.).

```prisma
model AppointmentParticipant {
  id            String   @id @default(cuid())
  
  // Appointment relationship
  appointmentId String
  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  
  // Participant information
  name          String
  email         String?
  phone         String?
  relationship  String?  // Relationship to primary customer
  
  // Status
  status        ParticipantStatus @default(INVITED)
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([appointmentId])
}

enum ParticipantStatus {
  INVITED
  CONFIRMED
  DECLINED
  ATTENDED
  NO_SHOW
}
```

## Provider Scheduling

### ProviderAvailability

Defines when providers are available for appointments.

```prisma
model ProviderAvailability {
  id         String   @id @default(cuid())
  
  // Provider relationship
  providerId String
  provider   Provider @relation(fields: [providerId], references: [id], onDelete: Cascade)
  
  // Availability definition
  dayOfWeek  Int      // 0 = Sunday, 1 = Monday, etc.
  startTime  String   // "09:00" format
  endTime    String   // "17:00" format
  
  // Date range (optional - for temporary availability)
  validFrom  DateTime?
  validTo    DateTime?
  
  // Status
  isActive   Boolean  @default(true)
  
  // Timestamps
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@index([providerId])
  @@index([dayOfWeek])
}
```

### ProviderSchedule

Specific schedule overrides and exceptions.

```prisma
model ProviderSchedule {
  id         String   @id @default(cuid())
  
  // Provider relationship
  providerId String
  provider   Provider @relation(fields: [providerId], references: [id], onDelete: Cascade)
  
  // Schedule definition
  date       DateTime @db.Date
  type       ScheduleType
  
  // Time slots (for available/busy types)
  startTime  String?  // "09:00" format
  endTime    String?  // "17:00" format
  
  // Additional information
  reason     String?
  notes      String?
  
  // Timestamps
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@index([providerId])
  @@index([date])
  @@unique([providerId, date, startTime, endTime])
}

enum ScheduleType {
  AVAILABLE    // Override normal availability
  UNAVAILABLE  // Block out time
  HOLIDAY      // Holiday closure
  VACATION     // Vacation time
  SICK         // Sick leave
  MEETING      // Internal meetings
  TRAINING     // Training sessions
}
```

## Authentication & Sessions

### Account

OAuth and external account connections.

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}
```

### Session

User session management.

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}
```

### VerificationToken

Email verification and password reset tokens.

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## Data Access Patterns

### Multi-Tenant Queries

All queries must include tenant filtering:

```typescript
// ✅ Correct - includes tenant filter
const appointments = await db.appointment.findMany({
  where: {
    tenantId: user.tenantId,
    providerId: providerId,
  }
})

// ❌ Incorrect - missing tenant filter (security risk)
const appointments = await db.appointment.findMany({
  where: {
    providerId: providerId,
  }
})
```

### Common Query Patterns

#### Get Provider's Appointments

```typescript
const appointments = await db.appointment.findMany({
  where: {
    tenantId: tenantId,
    providerId: providerId,
    startTime: {
      gte: startDate,
      lte: endDate,
    },
  },
  include: {
    customer: true,
    service: true,
    location: true,
    parameters: true,
  },
  orderBy: {
    startTime: 'asc',
  },
})
```

#### Check Provider Availability

```typescript
const availability = await db.providerAvailability.findMany({
  where: {
    providerId: providerId,
    isActive: true,
    OR: [
      { validFrom: null, validTo: null }, // Permanent availability
      {
        validFrom: { lte: checkDate },
        validTo: { gte: checkDate },
      },
    ],
  },
})
```

#### Get Service with Parameters

```typescript
const service = await db.service.findUnique({
  where: {
    id: serviceId,
    tenantId: tenantId,
  },
  include: {
    parameters: {
      orderBy: { order: 'asc' },
    },
  },
})
```

## Performance Considerations

### Database Indexes

Key indexes for performance:

```sql
-- Multi-tenancy indexes
CREATE INDEX idx_appointments_tenant_id ON appointments(tenant_id);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);

-- Query optimization indexes
CREATE INDEX idx_appointments_provider_start_time ON appointments(provider_id, start_time);
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Unique constraints for business rules
CREATE UNIQUE INDEX idx_customers_email_tenant ON customers(email, tenant_id);
CREATE UNIQUE INDEX idx_providers_user_id ON providers(user_id);
```

### Query Optimization

- **Eager Loading**: Use `include` for required relationships
- **Selective Fields**: Use `select` when only specific fields needed
- **Pagination**: Always paginate large result sets
- **Filtering**: Apply filters at database level, not in application

### Connection Pooling

```typescript
// Database client configuration
const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Connection pool settings in DATABASE_URL
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=5&pool_timeout=10"
```

## Migration Strategy

### Schema Evolution

1. **Additive Changes**: New columns with defaults
2. **Data Migration**: Scripts for transforming existing data
3. **Rollback Plan**: Always have a rollback strategy
4. **Testing**: Test migrations on copy of production data

### Example Migration

```sql
-- Add new column with default
ALTER TABLE appointments ADD COLUMN confirmation_code VARCHAR(255);

-- Populate existing records
UPDATE appointments SET confirmation_code = gen_random_uuid()::text WHERE confirmation_code IS NULL;

-- Add not null constraint
ALTER TABLE appointments ALTER COLUMN confirmation_code SET NOT NULL;

-- Add unique constraint
ALTER TABLE appointments ADD CONSTRAINT uk_appointments_confirmation_code UNIQUE (confirmation_code);
```

---

Next, learn about [Multi-Tenancy](/docs/architecture/multi-tenancy) implementation patterns.
