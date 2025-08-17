# Sloty Data Model (SaaS, Multi‑Tenant)

This document describes the **logical data structure** for **Sloty — SaaS Appointment System**.  
It’s technology-agnostic (no SQL), aligned with **multi-tenancy**, **nested booking parameters**, **availability**, and **billing**.

> All entities include `tenantId` unless otherwise noted. Timestamps are UTC (`createdAt`, `updatedAt`, etc.). IDs can be UUID/ULID/CUID.

---

## 1) Tenancy & Access

### Entities
- **Tenant**
  - id, name, legalName, billingEmail, defaultCurrency, timezone, status
  - createdAt, updatedAt
- **User**
  - id, tenantId, email, firstName, lastName, role (owner/admin/staff/viewer)
  - passwordHash _or_ externalIdentityProvider + externalSubject
  - isActive, lastLoginAt, createdAt, updatedAt

### Mermaid — Tenancy
```mermaid
erDiagram
    TENANT ||--o{ USER : "has"
    TENANT {
      string id
      string name
      string legalName
      string billingEmail
      string defaultCurrency
      string timezone
      string status
      datetime createdAt
      datetime updatedAt
    }
    USER {
      string id
      string tenantId
      string email
      string firstName
      string lastName
      string role
      string passwordHash
      string externalIdentityProvider
      string externalSubject
      boolean isActive
      datetime lastLoginAt
      datetime createdAt
      datetime updatedAt
    }
```

---

## 2) Locations, People & Providers

### Entities
- **Location**
  - id, tenantId, name, addressLine1, addressLine2, city, region, postalCode, countryCode, timezone, isActive
- **Person**
  - id, tenantId, firstName, lastName, email?, phone?, dateOfBirth?, notes?
- **Provider** (1‑to‑1 with Person)
  - id (= Person.id), tenantId, displayName?, licenseNumber?, isActive
- **Customer** (1‑to‑1 with Person)
  - id (= Person.id), tenantId, externalRef?, isActive
- **ProviderLocation**
  - tenantId, providerId, locationId

### Mermaid — People
```mermaid
erDiagram
    TENANT ||--o{ LOCATION : "has"
    TENANT ||--o{ PERSON : "has"
    PERSON ||--|| PROVIDER : "may be"
    PERSON ||--|| CUSTOMER : "may be"
    PROVIDER ||--o{ PROVIDER_LOCATION : "assigned to"
    LOCATION ||--o{ PROVIDER_LOCATION : "hosts"

    LOCATION {
      string id
      string tenantId
      string name
      string addressLine1
      string addressLine2
      string city
      string region
      string postalCode
      string countryCode
      string timezone
      boolean isActive
    }
    PERSON {
      string id
      string tenantId
      string firstName
      string lastName
      string email
      string phone
      date   dateOfBirth
      string notes
    }
    PROVIDER {
      string id
      string tenantId
      string displayName
      string licenseNumber
      boolean isActive
    }
    CUSTOMER {
      string id
      string tenantId
      string externalRef
      boolean isActive
    }
    PROVIDER_LOCATION {
      string tenantId
      string providerId
      string locationId
    }
```

---

## 3) Catalog: Specialties & Services

### Entities
- **Specialty**
  - id, tenantId, name, description?, isActive
- **ProviderSpecialty**
  - id, tenantId, providerId, specialtyId
- **Service**
  - id, tenantId, name, description?, specialtyId?, defaultDurationMinutes, defaultCapacity (default 1), isActive
- **ProviderService** (overrides per provider)
  - id, tenantId, providerId, serviceId, priceCents?, durationMinutes?, capacityOverride?, isActive

### Mermaid — Catalog
```mermaid
erDiagram
    TENANT ||--o{ SPECIALTY : "has"
    TENANT ||--o{ SERVICE : "offers"
    SPECIALTY ||--o{ PROVIDER_SPECIALTY : "links"
    PROVIDER ||--o{ PROVIDER_SPECIALTY : "has"
    SPECIALTY ||--o{ SERVICE : "groups"
    PROVIDER ||--o{ PROVIDER_SERVICE : "overrides"
    SERVICE  ||--o{ PROVIDER_SERVICE : "overridden by"

    SPECIALTY {
      string id
      string tenantId
      string name
      string description
      boolean isActive
    }
    SERVICE {
      string id
      string tenantId
      string name
      string description
      string specialtyId
      int    defaultDurationMinutes
      int    defaultCapacity
      boolean isActive
    }
    PROVIDER_SPECIALTY {
      string id
      string tenantId
      string providerId
      string specialtyId
    }
    PROVIDER_SERVICE {
      string id
      string tenantId
      string providerId
      string serviceId
      int    priceCents
      int    durationMinutes
      int    capacityOverride
      boolean isActive
    }
```

---

## 4) Parameters (Nested & Conditional)

### Concepts
- **ParameterDefinition** — describes a field (name + dataType + scope).
- **ParameterOption** — predefined options (for `enum`).
- **ServiceParameter** — binds parameter to a Service (+ required, default, visibility).
- **ParameterDependencyRule** — nesting logic (if parent X has Y, then show/hide/require child Z).
- **ParameterDependencyCondition** — operators for non-enum parents (>, >=, contains, inRange…).
- **AppointmentParameter** — values captured at booking.
- **CustomerParameter** (optional) — persistent preferences on the customer profile.

### Entities
- **ParameterDefinition**
  - id, tenantId, name, dataType (text|number|boolean|enum|date), scope (service|appointment|customer), isRequired, helpText?
- **ParameterOption**
  - id, tenantId, parameterId, value, label, isActive, sortOrder
- **ServiceParameter**
  - id, tenantId, serviceId, parameterId, required, defaultValue?, visibleInBooking (bool)
- **ParameterDependencyRule**
  - id, tenantId, parentParameterId, parentOptionId?, childParameterId, visibilityMode (show|hide|require), appliesTo (service|appointment|customer), serviceId?
- **ParameterDependencyCondition** (non‑enum parent support)
  - id, tenantId, dependencyRuleId, operator (equals|notEquals|gt|gte|lt|lte|contains|inRange|isTrue|isFalse), comparisonValue, secondaryValue?
- **AppointmentParameter**
  - id, tenantId, appointmentId, parameterId, value
- **CustomerParameter** (optional)
  - id, tenantId, customerId, parameterId, value

### Mermaid — Parameters
```mermaid
erDiagram
    SERVICE ||--o{ SERVICE_PARAMETER : "binds"
    PARAMETER_DEFINITION ||--o{ SERVICE_PARAMETER : "applies"
    PARAMETER_DEFINITION ||--o{ PARAMETER_OPTION : "has options"
    PARAMETER_DEFINITION ||--o{ PARAMETER_DEP_RULE : "as parent"
    PARAMETER_DEFINITION ||--o{ PARAMETER_DEP_RULE : "as child"
    PARAMETER_DEP_RULE ||--o{ PARAMETER_DEP_COND : "has conditions"
    APPOINTMENT ||--o{ APPOINTMENT_PARAMETER : "captures"
    PARAMETER_DEFINITION ||--o{ APPOINTMENT_PARAMETER : "instanced"

    PARAMETER_DEFINITION {
      string id
      string tenantId
      string name
      string dataType
      string scope
      boolean isRequired
      string helpText
    }
    PARAMETER_OPTION {
      string id
      string tenantId
      string parameterId
      string value
      string label
      boolean isActive
      int    sortOrder
    }
    SERVICE_PARAMETER {
      string id
      string tenantId
      string serviceId
      string parameterId
      boolean required
      string defaultValue
      boolean visibleInBooking
    }
    PARAMETER_DEP_RULE {
      string id
      string tenantId
      string parentParameterId
      string parentOptionId
      string childParameterId
      string visibilityMode
      string appliesTo
      string serviceId
    }
    PARAMETER_DEP_COND {
      string id
      string tenantId
      string dependencyRuleId
      string operator
      string comparisonValue
      string secondaryValue
    }
    APPOINTMENT_PARAMETER {
      string id
      string tenantId
      string appointmentId
      string parameterId
      string value
    }
```

---

## 5) Resources & Availability

### Entities
- **Resource**
  - id, tenantId, locationId, name, capacity, isActive
- **ProviderResource**
  - tenantId, providerId, resourceId
- **ProviderWorkingHours** (recurring weekly)
  - id, tenantId, providerId, locationId, weekday(0–6), startLocalTime, endLocalTime, serviceId?
- **ProviderTimeOff** (exceptions)
  - id, tenantId, providerId, startsAt, endsAt, reason?
- **LocationClosure**
  - id, tenantId, locationId, startsAt, endsAt, reason?
- **BookingRule** (per service or tenant default)
  - id, tenantId, serviceId?, minNoticeMinutes, maxHorizonDays, cancelCutoffMinutes, allowDoubleBook

### Mermaid — Availability
```mermaid
erDiagram
    LOCATION ||--o{ RESOURCE : "has"
    PROVIDER ||--o{ PROVIDER_RESOURCE : "can use"
    RESOURCE ||--o{ PROVIDER_RESOURCE : "is used by"
    PROVIDER ||--o{ PROVIDER_WORKING_HOURS : "weekly schedule"
    PROVIDER ||--o{ PROVIDER_TIME_OFF : "exceptions"
    LOCATION ||--o{ LOCATION_CLOSURE : "closures"
    SERVICE ||--o{ BOOKING_RULE : "governed by"
    TENANT ||--o{ BOOKING_RULE : "default rules"

    RESOURCE {
      string id
      string tenantId
      string locationId
      string name
      int    capacity
      boolean isActive
    }
    PROVIDER_RESOURCE {
      string tenantId
      string providerId
      string resourceId
    }
    PROVIDER_WORKING_HOURS {
      string id
      string tenantId
      string providerId
      string locationId
      int    weekday
      string startLocalTime
      string endLocalTime
      string serviceId
    }
    PROVIDER_TIME_OFF {
      string id
      string tenantId
      string providerId
      datetime startsAt
      datetime endsAt
      string reason
    }
    LOCATION_CLOSURE {
      string id
      string tenantId
      string locationId
      datetime startsAt
      datetime endsAt
      string reason
    }
    BOOKING_RULE {
      string id
      string tenantId
      string serviceId
      int    minNoticeMinutes
      int    maxHorizonDays
      int    cancelCutoffMinutes
      boolean allowDoubleBook
    }
```

---

## 6) Appointments & Booking Flow

### Entities
- **Appointment**
  - id, tenantId, locationId, providerId, resourceId?, serviceId
  - startAt, endAt, status (pending|confirmed|checked_in|completed|canceled|no_show)
  - priceCents?, notesPublic?, notesInternal?, createdByUserId?
- **AppointmentParticipant**
  - id, tenantId, appointmentId, customerId, role (attendee|guardian|interpreter…), checkInAt?
- **BookingHold** (short-lived lock)
  - id, tenantId, providerId, resourceId?, startAt, endAt, fingerprint, expiresAt

### Mermaid — Appointments
```mermaid
erDiagram
    PROVIDER ||--o{ APPOINTMENT : "performs"
    LOCATION ||--o{ APPOINTMENT : "hosts"
    SERVICE  ||--o{ APPOINTMENT : "booked for"
    APPOINTMENT ||--o{ APPOINTMENT_PARTICIPANT : "has"
    CUSTOMER ||--o{ APPOINTMENT_PARTICIPANT : "attends"
    PROVIDER ||--o{ BOOKING_HOLD : "blocks slot"

    APPOINTMENT {
      string id
      string tenantId
      string locationId
      string providerId
      string resourceId
      string serviceId
      datetime startAt
      datetime endAt
      string status
      int    priceCents
      string notesPublic
      string notesInternal
      string createdByUserId
    }
    APPOINTMENT_PARTICIPANT {
      string id
      string tenantId
      string appointmentId
      string customerId
      string role
      datetime checkInAt
    }
    BOOKING_HOLD {
      string id
      string tenantId
      string providerId
      string resourceId
      datetime startAt
      datetime endAt
      string fingerprint
      datetime expiresAt
    }
```

---

## 7) Billing & Payments (Tenant-Level)

### Entities
- **Product**: id, name, description, isActive
- **PricePlan**: id, productId, name, billingCycle(monthly|yearly), priceCents, currency, includesSeats, includesAppointmentsPerMonth?, overagePerAppointmentCents?, isActive
- **Subscription**: id, tenantId, productId, pricePlanId, status(trialing|active|past_due|canceled|paused), billingCycleAnchor, trialEnd?, cancelAtPeriodEnd?, externalProvider, externalSubscriptionId?
- **SubscriptionItem**: id, subscriptionId, name, priceCents, quantity
- **UsageEvent**: id, tenantId, subscriptionId, meter("appointments_booked"), quantity, occurredAt, recordedAt
- **Invoice**: id, tenantId, subscriptionId?, number, status(draft|open|paid|void), currency, subtotalCents, taxCents, totalCents, dueAt, issuedAt, externalProvider, externalInvoiceId?
- **InvoiceLine**: id, invoiceId, description, quantity, unitAmountCents, amountCents, metadata
- **Payment**: id, tenantId, invoiceId?, status(pending|succeeded|failed|refunded|partial_refund), amountCents, currency, paymentMethodId?, externalProvider, externalPaymentIntentId?, receivedAt
- **PaymentMethod**: id, tenantId, type(card|bank_transfer|pix|boleto|...),
  brand?, last4?, expMonth?, expYear?, holderName?, billingEmail?, billingAddress*, isDefault, externalProvider, externalPaymentMethodId

### Mermaid — Billing
```mermaid
erDiagram
    PRODUCT ||--o{ PRICE_PLAN : "has"
    TENANT  ||--o{ SUBSCRIPTION : "subscribes"
    PRODUCT ||--o{ SUBSCRIPTION : "on"
    PRICE_PLAN ||--o{ SUBSCRIPTION : "with"
    SUBSCRIPTION ||--o{ SUBSCRIPTION_ITEM : "includes"
    SUBSCRIPTION ||--o{ USAGE_EVENT : "records"
    TENANT ||--o{ INVOICE : "billed"
    SUBSCRIPTION ||--o{ INVOICE : "generates"
    INVOICE ||--o{ INVOICE_LINE : "contains"
    TENANT ||--o{ PAYMENT_METHOD : "stores"
    TENANT ||--o{ PAYMENT : "makes"
    INVOICE ||--o{ PAYMENT : "paid by"

    PRODUCT {
      string id
      string name
      string description
      boolean isActive
    }
    PRICE_PLAN {
      string id
      string productId
      string name
      string billingCycle
      int    priceCents
      string currency
      int    includesSeats
      int    includesAppointmentsPerMonth
      int    overagePerAppointmentCents
      boolean isActive
    }
    SUBSCRIPTION {
      string id
      string tenantId
      string productId
      string pricePlanId
      string status
      datetime billingCycleAnchor
      datetime trialEnd
      boolean cancelAtPeriodEnd
      string externalProvider
      string externalSubscriptionId
    }
    SUBSCRIPTION_ITEM {
      string id
      string subscriptionId
      string name
      int    priceCents
      int    quantity
    }
    USAGE_EVENT {
      string id
      string tenantId
      string subscriptionId
      string meter
      int    quantity
      datetime occurredAt
      datetime recordedAt
    }
    INVOICE {
      string id
      string tenantId
      string subscriptionId
      string number
      string status
      string currency
      int    subtotalCents
      int    taxCents
      int    totalCents
      datetime dueAt
      datetime issuedAt
      string externalProvider
      string externalInvoiceId
    }
    INVOICE_LINE {
      string id
      string invoiceId
      string description
      int    quantity
      int    unitAmountCents
      int    amountCents
      string metadata
    }
    PAYMENT_METHOD {
      string id
      string tenantId
      string type
      string brand
      string last4
      int    expMonth
      int    expYear
      string holderName
      string billingEmail
      string billingAddressLine1
      string billingAddressLine2
      string billingCity
      string billingRegion
      string billingPostalCode
      string billingCountryCode
      boolean isDefault
      string externalProvider
      string externalPaymentMethodId
    }
    PAYMENT {
      string id
      string tenantId
      string invoiceId
      string status
      int    amountCents
      string currency
      string paymentMethodId
      string externalProvider
      string externalPaymentIntentId
      datetime receivedAt
    }
```

---

## 8) Notifications (Optional)

### Entities
- **Notification**
  - id, tenantId, type(booking_confirmation|reminder|cancelation|payment_receipt|...), channel(email|sms|push|whatsapp), toPersonId?, toAddress, payload(json/text), status(queued|sent|failed), scheduledFor?, sentAt?, createdAt, updatedAt
- **CustomerPreference**
  - id, tenantId, customerId, channel(email|sms|whatsapp), optIn, createdAt, updatedAt

---

## 9) API Payload Examples

### Create Appointment (simplified)
```json
{
  "tenantId": "t_123",
  "locationId": "loc_1",
  "providerId": "prov_1",
  "serviceId": "svc_1",
  "startAt": "2025-08-19T14:00:00Z",
  "endAt": "2025-08-19T14:30:00Z",
  "participantCustomerIds": ["cus_1"],
  "parameters": [
    { "parameterId": "p_visitType", "value": "Specialist" },
    { "parameterId": "p_specialty", "value": "Dermatology" }
  ]
}
```

### Parameter Dependency Rule
```json
{
  "tenantId": "t_123",
  "parentParameterId": "p_visitType",
  "parentOptionId": "opt_specialist",
  "childParameterId": "p_specialty",
  "visibilityMode": "require",
  "appliesTo": "appointment"
}
```

---

## 10) Indexing & Constraints (Guidance)

- Unique within tenant (e.g., `(tenantId, email)` on User, `(tenantId, name)` on Service/Specialty).
- Time-range indexes on Appointment/BookingHold for fast slot checks.
- Consider soft-delete (`deletedAt`) for recoverability and audit.
- Enforce tenant isolation in the application layer (and/or DB RLS when available).

---

## 11) Minimal Slot Generation (Concept)

1. Get **ProviderWorkingHours** for the date (by weekday, location, optional serviceId).
2. Subtract **ProviderTimeOff** and **LocationClosure** ranges.
3. Remove overlaps with existing **Appointments** (status not in canceled/no_show) and non‑expired **BookingHolds**.
4. Chunk by `duration` (from ProviderService override or Service default).
5. Apply **BookingRule** (minNotice, horizon).
6. Apply **ParameterDependencyRule** visibility/required logic for the booking UI.

---

**End of document.**
