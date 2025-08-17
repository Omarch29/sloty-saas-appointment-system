---
sidebar_position: 2
---

# Configuration

Learn how to configure Sloty for your specific needs and environment.

## Environment Variables

Sloty uses environment variables for configuration. Here's a comprehensive guide to all available settings:

### Core Settings

```bash
# Application Environment
NODE_ENV="development" # development|production|test

# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication & Security
NEXTAUTH_SECRET="your-very-secure-secret-key-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000" # Your domain in production

# Encryption Keys (generate with: openssl rand -base64 32)
ENCRYPTION_KEY="your-encryption-key-for-sensitive-data"
```

### Database Configuration

#### Development Database
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/sloty_dev"
```

#### Production Database
```bash
DATABASE_URL="postgresql://user:password@production-host:5432/sloty_prod?sslmode=require"
```

#### Test Database
```bash
DATABASE_TEST_URL="postgresql://postgres:password@localhost:5432/sloty_test"
```

### Authentication Providers

Sloty supports multiple authentication providers via NextAuth.js:

#### Email/Password (Default)
```bash
# No additional configuration required
NEXTAUTH_SECRET="your-secret"
```

#### Google OAuth
```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### GitHub OAuth
```bash
GITHUB_ID="your-github-app-id"
GITHUB_SECRET="your-github-app-secret"
```

#### Azure AD
```bash
AZURE_AD_CLIENT_ID="your-azure-ad-client-id"
AZURE_AD_CLIENT_SECRET="your-azure-ad-client-secret"
AZURE_AD_TENANT_ID="your-azure-ad-tenant-id"
```

### Email & Notifications

#### SMTP Configuration
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false" # true for 465, false for other ports
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@yourdomain.com"
```

#### SendGrid
```bash
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM="noreply@yourdomain.com"
```

#### Twilio (SMS)
```bash
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Storage & File Uploads

#### AWS S3
```bash
AWS_REGION="us-west-2"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET="your-s3-bucket-name"
```

#### Local Storage
```bash
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760" # 10MB in bytes
ALLOWED_FILE_TYPES="image/jpeg,image/png,application/pdf"
```

### Payment Processing

#### Stripe
```bash
STRIPE_PUBLISHABLE_KEY="pk_test_your-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
```

#### PayPal
```bash
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_MODE="sandbox" # sandbox|live
```

### Feature Flags

```bash
# Enable/disable features
FEATURE_BILLING="true"
FEATURE_SMS_NOTIFICATIONS="true"
FEATURE_CALENDAR_SYNC="false"
FEATURE_ADVANCED_REPORTING="true"
```

### Monitoring & Analytics

#### Application Monitoring
```bash
SENTRY_DSN="your-sentry-dsn"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="your-sentry-project"
```

#### Analytics
```bash
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
MIXPANEL_TOKEN="your-mixpanel-token"
```

## Application-Specific Configuration

Each application can have specific configuration:

### Backoffice Application
```bash
# apps/backoffice/.env.local
NEXT_PUBLIC_APP_NAME="Sloty Admin"
NEXT_PUBLIC_SUPPORT_EMAIL="support@yourdomain.com"
```

### Tenant Application  
```bash
# apps/tenant/.env.local
NEXT_PUBLIC_APP_NAME="Sloty Practice"
NEXT_PUBLIC_BOOKING_URL="https://book.yourdomain.com"
```

### Booking Application
```bash
# apps/booking/.env.local
NEXT_PUBLIC_APP_NAME="Book Appointment"
NEXT_PUBLIC_COMPANY_NAME="Your Healthcare Network"
```

## Configuration Files

### Tailwind Configuration

Each app has its own Tailwind config for customization:

```javascript
// apps/booking/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        brand: '#your-brand-color',
      },
    },
  },
}
```

### Database Configuration

#### Prisma Schema Configuration
```prisma
// packages/db/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Connection Pooling
```bash
# For production with connection pooling
DATABASE_URL="postgresql://user:password@host:5432/db?pgbouncer=true&connection_limit=10"
```

## Environment-Specific Configuration

### Development
```bash
# .env.local
NODE_ENV="development"
DATABASE_URL="postgresql://postgres:password@localhost:5432/sloty_dev"
NEXTAUTH_URL="http://localhost:3000"
LOG_LEVEL="debug"
```

### Staging
```bash
# .env.staging
NODE_ENV="production"
DATABASE_URL="postgresql://user:password@staging-db:5432/sloty_staging"
NEXTAUTH_URL="https://staging.yourdomain.com"
LOG_LEVEL="info"
```

### Production
```bash
# .env.production
NODE_ENV="production"
DATABASE_URL="postgresql://user:password@prod-db:5432/sloty_prod?sslmode=require"
NEXTAUTH_URL="https://yourdomain.com"
LOG_LEVEL="warn"

# Security headers
SECURITY_HEADERS="true"
CSP_REPORT_URI="https://yourdomain.report-uri.com/r/default/csp/enforce"
```

## Advanced Configuration

### Multi-Database Setup

For scaling, you can configure read replicas:

```bash
DATABASE_URL="postgresql://user:password@primary:5432/sloty"
DATABASE_READ_URL="postgresql://user:password@replica:5432/sloty"
```

### Redis Configuration

For session storage and caching:

```bash
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD="your-redis-password"
```

### Rate Limiting
```bash
RATE_LIMIT_ENABLED="true"
RATE_LIMIT_REQUESTS="100"
RATE_LIMIT_WINDOW="900" # 15 minutes in seconds
```

## Validation & Testing

### Configuration Validation

Sloty validates configuration on startup:

```javascript
// packages/config/src/validate.ts
import { z } from 'zod'

const configSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
})

export const config = configSchema.parse(process.env)
```

### Testing Configuration

```bash
# Test configuration
pnpm test:config

# Test database connection
pnpm test:db

# Test all integrations
pnpm test:integration
```

## Security Considerations

### Secret Management

Never commit secrets to version control:

```bash
# Use environment-specific files
.env.local          # Development
.env.staging        # Staging
.env.production     # Production

# These should be in .gitignore
echo ".env*" >> .gitignore
```

### Production Security

```bash
# Use strong secrets (minimum 32 characters)
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Enable security headers
SECURITY_HEADERS="true"

# Use secure database connections
DATABASE_URL="postgresql://...?sslmode=require"
```

## Configuration Management

### Using Docker Secrets

```yaml
# docker-compose.yml
services:
  app:
    environment:
      DATABASE_URL_FILE: /run/secrets/db_url
    secrets:
      - db_url

secrets:
  db_url:
    external: true
```

### Using Kubernetes ConfigMaps

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: sloty-config
data:
  NODE_ENV: "production"
  NEXTAUTH_URL: "https://yourdomain.com"
```

## Next Steps

After configuring your system:

1. [Create Your First Tenant](/docs/getting-started/first-tenant)
2. [Understand the Architecture](/docs/architecture/overview)
3. [Set Up Authentication](/docs/auth/overview)

---

Need help with advanced configuration? Check the [Troubleshooting Guide](/docs/development/troubleshooting).
