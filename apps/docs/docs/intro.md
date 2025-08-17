---
sidebar_position: 1
---

# Sloty SaaS Appointment System

Welcome to **Sloty**, a comprehensive multi-tenant SaaS appointment booking system built with modern web technologies.

## What is Sloty?

Sloty is a powerful, scalable appointment booking platform designed for healthcare providers, service businesses, and any organization that needs to manage appointments efficiently. Built with Next.js, TypeScript, and Prisma, Sloty offers:

### 🏥 **Multi-Tenant Architecture**
- Complete tenant isolation with secure data separation
- Customizable branding and configuration per tenant
- Scalable from single practices to enterprise healthcare networks

### 📅 **Advanced Booking Engine**
- Intelligent slot generation based on provider availability
- Complex parameter dependencies and conditional forms
- Real-time availability checking with booking holds
- Automated conflict resolution and double-booking prevention

### 🎯 **Rich Service Catalog**
- Flexible service definitions with specialties
- Provider-specific service configurations
- Dynamic pricing and duration overrides
- Custom parameter collection for appointments

### 🔒 **Enterprise Security**
- Role-based access control (RBAC)
- Secure authentication with NextAuth.js
- Complete audit trails and data encryption
- HIPAA-compliant data handling capabilities

### 📊 **Comprehensive Management**
- Multi-location support with working hours
- Provider time-off and location closure management
- Automated billing and subscription management
- Rich notification system (email, SMS, push)

## Architecture Overview

Sloty is built as a modern monorepo with the following structure:

```
sloty-saas-appointment-system/
├── apps/
│   ├── backoffice/     # Tenant management dashboard
│   ├── tenant/         # Provider admin interface  
│   ├── booking/        # Customer booking interface
│   └── docs/           # This documentation site
├── packages/
│   ├── auth/           # Authentication utilities
│   ├── db/             # Database schema & migrations
│   ├── ui/             # Shared UI components
│   └── config/         # Configuration & slot engine
```

## Key Features

### **Smart Slot Engine**
Our proprietary slot generation engine considers:
- Provider working hours and availability
- Service duration and capacity requirements
- Location constraints and resources
- Existing appointments and time blocks
- Custom booking rules and restrictions

### **Parameter Dependencies**
Dynamic form generation with:
- Conditional field visibility based on selections
- Complex validation rules and dependencies
- Custom data types and validation patterns
- Service-specific parameter requirements

### **Multi-Application Setup**
- **Backoffice**: Superadmin tenant management
- **Tenant App**: Provider admin dashboard
- **Booking App**: Customer-facing booking interface
- **Documentation**: Comprehensive developer docs

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL with multi-tenant schema
- **Authentication**: NextAuth.js with role-based access
- **UI**: Tailwind CSS, Radix UI components
- **Testing**: Vitest, Testing Library, Playwright
- **Deployment**: Docker, CI/CD with GitHub Actions

## Quick Start

Get started with Sloty in minutes:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Omarch29/sloty-saas-appointment-system.git
   cd sloty-saas-appointment-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup database**
   ```bash
   pnpm prisma:migrate
   pnpm prisma:seed
   ```

4. **Start development**
   ```bash
   pnpm dev
   ```

Visit the [Getting Started](/docs/getting-started/installation) guide for detailed setup instructions.

## What's Next?

- 📖 **[Architecture Overview](/docs/architecture/overview)** - Understand the system design
- 🚀 **[Installation Guide](/docs/getting-started/installation)** - Set up your development environment
- 🏗️ **[Data Model](/docs/architecture/data-model)** - Explore the database schema
- 🔐 **[Authentication](/docs/auth/overview)** - Learn about security and access control

## Community & Support

- **GitHub**: [Source code and issues](https://github.com/Omarch29/sloty-saas-appointment-system)
- **Documentation**: You're reading it! 📖
- **Testing**: Comprehensive test suite with 100% CI coverage

---

Ready to build the next generation of appointment booking systems? Let's get started! 🚀
