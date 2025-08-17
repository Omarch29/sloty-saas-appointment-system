---
sidebar_position: 1
---

# Installation

This guide will walk you through setting up Sloty on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (18.x or 20.x)
- **pnpm** (9.x or later)
- **PostgreSQL** (15.x or later)
- **Git**

### System Requirements

| Component | Minimum Version | Recommended |
|-----------|----------------|-------------|
| Node.js   | 18.0.0         | 20.x LTS    |
| pnpm      | 9.0.0          | Latest      |
| PostgreSQL| 15.0           | 15.x        |
| RAM       | 4GB            | 8GB+        |
| Storage   | 2GB            | 5GB+        |

## Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Omarch29/sloty-saas-appointment-system.git
cd sloty-saas-appointment-system
```

### 2. Install Dependencies

```bash
# Install all dependencies for the monorepo
pnpm install
```

This command will install dependencies for all applications and packages in the monorepo.

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/sloty_dev"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Email Configuration (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 4. Database Setup

Create and configure your PostgreSQL database:

```bash
# Create the database (if not exists)
createdb sloty_dev

# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# Seed the database with sample data
pnpm prisma:seed
```

### 5. Build Packages

Build all shared packages:

```bash
pnpm build:packages
```

### 6. Start Development

Start all applications in development mode:

```bash
pnpm dev
```

This will start:
- **Backoffice**: http://localhost:3000 (Superadmin interface)
- **Tenant App**: http://localhost:3001 (Provider admin)
- **Booking App**: http://localhost:3002 (Customer booking)
- **Documentation**: http://localhost:3003 (This site)

## Individual Application Setup

You can also start applications individually:

### Backoffice (Superadmin)
```bash
pnpm dev:backoffice
# Available at: http://localhost:3000
```

### Tenant Application
```bash
pnpm dev:tenant
# Available at: http://localhost:3001
```

### Booking Application
```bash
pnpm dev:booking
# Available at: http://localhost:3002
```

### Documentation
```bash
pnpm docs:dev
# Available at: http://localhost:3003
```

## Verification

After installation, verify everything is working:

1. **Database Connection**: Visit any application and check if data loads
2. **Authentication**: Try logging in with seed user credentials
3. **API Endpoints**: Check that APIs respond correctly
4. **Build Process**: Run `pnpm build` to ensure everything compiles

### Default Seed Data

The seed script creates:
- **Superadmin User**: `admin@sloty.com` / `password123`
- **Sample Tenant**: "Downtown Health Center"
- **Sample Provider**: "Dr. Sarah Johnson"
- **Sample Services**: General consultation, physical exam, etc.

## Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Verify database exists
psql -l | grep sloty_dev
```

#### Port Already in Use
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9
```

#### Module Resolution Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### Prisma Issues
```bash
# Reset and regenerate Prisma client
pnpm prisma:reset
pnpm prisma:generate
pnpm prisma:migrate
```

### Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](/docs/development/troubleshooting)
2. Review the [GitHub Issues](https://github.com/Omarch29/sloty-saas-appointment-system/issues)
3. Ensure all prerequisites are correctly installed
4. Verify environment variables are properly set

## Next Steps

Once installation is complete:

1. [Configuration](/docs/getting-started/configuration) - Configure your system
2. [First Tenant](/docs/getting-started/first-tenant) - Create your first tenant
3. [Architecture Overview](/docs/architecture/overview) - Understand the system design

---

Ready to configure your system? Continue to the [Configuration Guide](/docs/getting-started/configuration).
