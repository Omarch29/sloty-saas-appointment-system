---
sidebar_position: 1
---

# API Reference Overview

Comprehensive API documentation for integrating with the Sloty appointment booking system.

## Base URLs

The Sloty API is organized across multiple applications with different base URLs:

### Development
- **Backoffice API**: `http://localhost:3000/api`
- **Tenant API**: `http://localhost:3001/api`
- **Booking API**: `http://localhost:3002/api`

### Production
- **Backoffice API**: `https://admin.yourdomain.com/api`
- **Tenant API**: `https://dashboard.yourdomain.com/api`
- **Booking API**: `https://yourdomain.com/api`

## Authentication

### API Key Authentication

Most API endpoints require authentication using NextAuth.js sessions or API keys.

```javascript
// Using session cookie (browser)
fetch('/api/appointments', {
  credentials: 'include',
})

// Using Authorization header (server-to-server)
fetch('/api/appointments', {
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json',
  }
})
```

### Tenant Context

All API requests must include tenant context, either through:

1. **Subdomain**: `https://tenant-slug.yourdomain.com/api/`
2. **Header**: `X-Tenant-Slug: tenant-slug`
3. **URL Parameter**: `/api/endpoint?tenant=tenant-slug`

## Request/Response Format

### Request Format

All requests should use JSON format with proper Content-Type headers:

```javascript
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

### Response Format

All responses follow a consistent structure:

```typescript
// Successful response
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_1234567890"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_1234567890"
  }
}
```

## HTTP Status Codes

Standard HTTP status codes are used throughout the API:

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (duplicate) |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 1000 requests per minute
- **Booking endpoints**: 10 requests per minute per IP

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

## Pagination

List endpoints support cursor-based pagination:

### Request Parameters
```
GET /api/appointments?limit=20&cursor=eyJ0aW1lc3RhbXAiOi...
```

### Response Format
```json
{
  "success": true,
  "data": [
    // ... array of items
  ],
  "pagination": {
    "hasMore": true,
    "nextCursor": "eyJ0aW1lc3RhbXAiOi...",
    "limit": 20,
    "total": 150
  }
}
```

## Filtering and Sorting

List endpoints support filtering and sorting:

### Filtering
```
GET /api/appointments?status=confirmed&provider_id=123&date_from=2024-01-01
```

### Sorting
```
GET /api/appointments?sort=start_time&order=desc
```

### Available Filters by Endpoint

**Appointments**:
- `status`: confirmed, scheduled, cancelled, completed
- `provider_id`: Provider ID
- `customer_id`: Customer ID
- `service_id`: Service ID
- `date_from`: ISO date string
- `date_to`: ISO date string

**Customers**:
- `search`: Search by name or email
- `created_after`: ISO date string
- `status`: active, inactive

**Services**:
- `category`: Service category
- `active`: true/false
- `provider_id`: Provider ID

## Webhooks

Sloty can send webhooks for important events:

### Supported Events
- `appointment.created`
- `appointment.updated`
- `appointment.cancelled`
- `customer.created`
- `payment.completed`
- `reminder.sent`

### Webhook Configuration

Configure webhooks in tenant settings:

```json
{
  "webhooks": [
    {
      "url": "https://your-app.com/webhooks/sloty",
      "events": ["appointment.created", "appointment.cancelled"],
      "secret": "webhook-secret-key"
    }
  ]
}
```

### Webhook Payload

```json
{
  "event": "appointment.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "appointment": {
      "id": "apt_1234567890",
      "customer": { /* customer data */ },
      "provider": { /* provider data */ },
      "service": { /* service data */ },
      "start_time": "2024-01-20T14:00:00Z",
      "end_time": "2024-01-20T14:30:00Z",
      "status": "confirmed"
    }
  },
  "tenant": {
    "id": "tenant_123",
    "slug": "acme-clinic"
  }
}
```

## Error Handling

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_ERROR` | Authentication failed |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `RESOURCE_CONFLICT` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `TENANT_NOT_FOUND` | Tenant context not found |
| `SERVICE_UNAVAILABLE` | Temporary service issue |

### Handling Errors

```javascript
async function bookAppointment(appointmentData) {
  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData)
    })
    
    const result = await response.json()
    
    if (!result.success) {
      // Handle API error
      console.error('API Error:', result.error)
      
      if (result.error.code === 'VALIDATION_ERROR') {
        // Handle validation errors
        result.error.details.forEach(error => {
          console.error(`${error.field}: ${error.message}`)
        })
      }
      
      return null
    }
    
    return result.data
  } catch (error) {
    // Handle network error
    console.error('Network Error:', error)
    return null
  }
}
```

## SDK and Libraries

### Official SDKs

**JavaScript/TypeScript SDK**:
```bash
npm install @sloty/sdk
```

```javascript
import { SlotyClient } from '@sloty/sdk'

const client = new SlotyClient({
  apiKey: 'your-api-key',
  tenantSlug: 'your-tenant-slug',
  environment: 'production' // or 'development'
})

// Create appointment
const appointment = await client.appointments.create({
  customerId: 'customer_123',
  serviceId: 'service_456',
  providerId: 'provider_789',
  startTime: '2024-01-20T14:00:00Z'
})
```

**Python SDK**:
```bash
pip install sloty-python
```

```python
from sloty import SlotyClient

client = SlotyClient(
    api_key='your-api-key',
    tenant_slug='your-tenant-slug',
    environment='production'
)

# Create appointment
appointment = client.appointments.create({
    'customer_id': 'customer_123',
    'service_id': 'service_456',
    'provider_id': 'provider_789',
    'start_time': '2024-01-20T14:00:00Z'
})
```

### Community Libraries

- **PHP SDK**: `composer require sloty/sloty-php`
- **Ruby Gem**: `gem install sloty-ruby`
- **Go Module**: `go get github.com/sloty/sloty-go`

## OpenAPI Specification

Download the complete OpenAPI (Swagger) specification:

- **OpenAPI 3.0 Spec**: [Download JSON](/api/openapi.json)
- **Swagger UI**: [Interactive API Explorer](/api/docs)
- **Postman Collection**: [Import Collection](/api/postman.json)

## Testing

### Test Environment

Use the test environment for development and testing:

- **Base URL**: `https://api-test.sloty.com`
- **Test Tenant**: `test-clinic`
- **Test API Key**: Available in developer dashboard

### Test Data

The test environment includes sample data:

```javascript
// Test customer
const testCustomer = {
  id: 'customer_test_123',
  email: 'john.doe@example.com',
  name: 'John Doe'
}

// Test provider
const testProvider = {
  id: 'provider_test_456',
  email: 'dr.smith@testclinic.com',
  name: 'Dr. Smith'
}

// Test service
const testService = {
  id: 'service_test_789',
  name: 'General Consultation',
  duration: 30
}
```

## API Endpoints

### Core Resources

1. **[Tenants](/docs/api-reference/tenants)** - Tenant management
2. **[Users](/docs/api-reference/users)** - User management
3. **[Providers](/docs/api-reference/providers)** - Provider management
4. **[Services](/docs/api-reference/services)** - Service catalog
5. **[Customers](/docs/api-reference/customers)** - Customer management
6. **[Appointments](/docs/api-reference/appointments)** - Appointment booking
7. **[Availability](/docs/api-reference/availability)** - Provider availability

### Utility Endpoints

8. **[Webhooks](/docs/api-reference/webhooks)** - Webhook management
9. **[Analytics](/docs/api-reference/analytics)** - Reporting and analytics
10. **[Settings](/docs/api-reference/settings)** - Configuration management

## Quick Start Examples

### Book an Appointment

```javascript
// 1. Get available slots
const slots = await fetch('/api/availability', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceId: 'service_123',
    providerId: 'provider_456',
    date: '2024-01-20'
  })
})

// 2. Create customer (if new)
const customer = await fetch('/api/customers', {
  method: 'POST',
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890'
  })
})

// 3. Book appointment
const appointment = await fetch('/api/appointments', {
  method: 'POST',
  body: JSON.stringify({
    customerId: customer.data.id,
    serviceId: 'service_123',
    providerId: 'provider_456',
    startTime: '2024-01-20T14:00:00Z',
    parameters: {
      reason: 'Annual checkup'
    }
  })
})
```

### Get Provider Schedule

```javascript
const schedule = await fetch('/api/providers/provider_123/schedule', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your-api-token'
  }
})

console.log(schedule.data)
// {
//   "provider": { /* provider info */ },
//   "appointments": [ /* today's appointments */ ],
//   "availability": { /* available slots */ }
// }
```

---

Explore specific API endpoints:
- [Appointments API](/docs/api-reference/appointments) - Complete appointment management
- [Providers API](/docs/api-reference/providers) - Provider and availability management
- [Services API](/docs/api-reference/services) - Service catalog management
