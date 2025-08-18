---
sidebar_position: 4
---

# Deployment Guide

Learn how to deploy Sloty to production environments with confidence.

## Deployment Options

Sloty supports multiple deployment strategies to fit your infrastructure needs:

### 1. Vercel (Recommended for Quick Start)
- **Best for**: Rapid deployment, automatic scaling
- **Pros**: Easy setup, built-in CI/CD, global CDN
- **Cons**: Vendor lock-in, limited customization

### 2. Docker + VPS
- **Best for**: Full control, cost optimization
- **Pros**: Complete control, portable, cost-effective
- **Cons**: Requires DevOps knowledge

### 3. Kubernetes
- **Best for**: Enterprise deployments, high availability
- **Pros**: Auto-scaling, high availability, enterprise features
- **Cons**: Complex setup, requires expertise

### 4. Traditional VPS
- **Best for**: Simple deployments, budget constraints
- **Pros**: Simple, cost-effective, full control
- **Cons**: Manual scaling, more maintenance

## Pre-Deployment Checklist

Before deploying to production:

### ✅ Security Audit
- [ ] Environment variables properly set
- [ ] Database credentials secured
- [ ] HTTPS certificates configured
- [ ] CORS settings reviewed
- [ ] Rate limiting enabled
- [ ] Input validation comprehensive

### ✅ Performance Optimization
- [ ] Database indexes optimized
- [ ] Bundle size analyzed and optimized
- [ ] Image optimization configured
- [ ] CDN setup for static assets
- [ ] Caching strategy implemented

### ✅ Monitoring & Logging
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Performance monitoring setup
- [ ] Database monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Log aggregation setup

### ✅ Backup Strategy
- [ ] Database backup automation
- [ ] File storage backup plan
- [ ] Disaster recovery plan
- [ ] Backup restoration tested

## Option 1: Vercel Deployment

### Prerequisites

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

### Configuration

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/backoffice/package.json",
      "use": "@vercel/next",
      "config": { "distDir": ".next" }
    },
    {
      "src": "apps/tenant/package.json", 
      "use": "@vercel/next",
      "config": { "distDir": ".next" }
    },
    {
      "src": "apps/booking/package.json",
      "use": "@vercel/next",
      "config": { "distDir": ".next" }
    }
  ],
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "apps/backoffice/$1"
    },
    {
      "src": "/dashboard/(.*)",
      "dest": "apps/tenant/$1"
    },
    {
      "src": "/(.*)",
      "dest": "apps/booking/$1"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url"
  }
}
```

### Environment Variables

Set up environment variables in Vercel dashboard:

```bash
# Required variables
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Optional integrations
SENDGRID_API_KEY="your-sendgrid-key"
TWILIO_ACCOUNT_SID="your-twilio-sid"
STRIPE_SECRET_KEY="your-stripe-key"
```

### Deploy

```bash
# Build and deploy
pnpm build
vercel --prod
```

## Option 2: Docker Deployment

### Multi-Stage Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/ ./apps/
COPY packages/ ./packages/

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Build applications
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=builder --chown=nextjs:nodejs /app/apps ./apps
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER nextjs

EXPOSE 3000 3001 3002

# Start all applications
CMD ["pnpm", "start"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: sloty
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis for sessions
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Sloty Application
  app:
    build: .
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@postgres:5432/sloty
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    ports:
      - "3000:3000"  # Backoffice
      - "3001:3001"  # Tenant
      - "3002:3002"  # Booking
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backoffice {
        server app:3000;
    }
    
    upstream tenant {
        server app:3001;
    }
    
    upstream booking {
        server app:3002;
    }

    # Backoffice - admin.yourdomain.com
    server {
        listen 80;
        server_name admin.yourdomain.com;
        
        location / {
            proxy_pass http://backoffice;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # Tenant Dashboard - dashboard.yourdomain.com  
    server {
        listen 80;
        server_name dashboard.yourdomain.com;
        
        location / {
            proxy_pass http://tenant;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # Booking - yourdomain.com and *.yourdomain.com
    server {
        listen 80 default_server;
        server_name yourdomain.com *.yourdomain.com;
        
        location / {
            proxy_pass http://booking;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### Deploy with Docker

```bash
# Create .env file
echo "DB_PASSWORD=your-secure-password" > .env
echo "NEXTAUTH_SECRET=your-secret-key" >> .env
echo "NEXTAUTH_URL=https://yourdomain.com" >> .env

# Deploy
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

## Option 3: Kubernetes Deployment

### Namespace and ConfigMap

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: sloty

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: sloty-config
  namespace: sloty
data:
  NODE_ENV: "production"
  NEXTAUTH_URL: "https://yourdomain.com"
```

### Secrets

```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: sloty-secrets
  namespace: sloty
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:pass@postgres:5432/sloty"
  NEXTAUTH_SECRET: "your-nextauth-secret"
  SENDGRID_API_KEY: "your-sendgrid-key"
```

### PostgreSQL Deployment

```yaml
# k8s/postgres.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: sloty
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: sloty
        - name: POSTGRES_USER
          value: postgres
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: sloty
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

### Application Deployment

```yaml
# k8s/app.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sloty-app
  namespace: sloty
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sloty-app
  template:
    metadata:
      labels:
        app: sloty-app
    spec:
      containers:
      - name: sloty
        image: your-registry/sloty:latest
        envFrom:
        - configMapRef:
            name: sloty-config
        - secretRef:
            name: sloty-secrets
        ports:
        - containerPort: 3000
        - containerPort: 3001  
        - containerPort: 3002
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: sloty-app-service
  namespace: sloty
spec:
  selector:
    app: sloty-app
  ports:
  - name: backoffice
    port: 3000
    targetPort: 3000
  - name: tenant
    port: 3001
    targetPort: 3001
  - name: booking
    port: 3002
    targetPort: 3002
```

### Ingress Configuration

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: sloty-ingress
  namespace: sloty
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - yourdomain.com
    - admin.yourdomain.com
    - dashboard.yourdomain.com
    secretName: sloty-tls
  rules:
  - host: admin.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: sloty-app-service
            port:
              number: 3000
  - host: dashboard.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: sloty-app-service
            port:
              number: 3001
  - host: yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: sloty-app-service
            port:
              number: 3002
```

### Deploy to Kubernetes

```bash
# Apply configurations
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n sloty
kubectl get services -n sloty
kubectl get ingress -n sloty

# View logs
kubectl logs -f deployment/sloty-app -n sloty
```

## Database Migration

### Production Migration Script

```bash
#!/bin/bash
# scripts/migrate-production.sh

set -e

echo "🚀 Starting production migration..."

# Backup database
echo "📦 Creating database backup..."
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Run migrations
echo "🔧 Running database migrations..."
pnpm prisma migrate deploy

# Generate Prisma client
echo "⚡ Generating Prisma client..."
pnpm prisma generate

# Seed initial data if needed
if [[ "$SEED_DATA" == "true" ]]; then
  echo "🌱 Seeding initial data..."
  pnpm prisma db seed
fi

echo "✅ Migration completed successfully!"
```

## Monitoring & Observability

### Health Checks

Add health check endpoints:

```typescript
// app/api/health/route.ts
import { db } from '@repo/db'

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'up',
        redis: 'up' // Add Redis check if using
      }
    })
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 503 })
  }
}
```

### Error Tracking with Sentry

```bash
# Install Sentry
pnpm add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
})
```

### Uptime Monitoring

Set up monitoring with services like:
- **Uptime Robot**: Simple uptime monitoring
- **Pingdom**: Comprehensive monitoring
- **DataDog**: Enterprise monitoring
- **New Relic**: APM and monitoring

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificates
sudo certbot --nginx -d yourdomain.com -d admin.yourdomain.com -d dashboard.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Backup Strategy

### Automated Database Backups

```bash
#!/bin/bash
# scripts/backup-database.sh

BACKUP_DIR="/var/backups/sloty"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/sloty-$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "✅ Backup completed: $BACKUP_FILE.gz"
```

Set up cron job:
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/scripts/backup-database.sh
```

## Performance Optimization

### Database Optimization

```sql
-- Add performance indexes
CREATE INDEX CONCURRENTLY idx_appointments_tenant_provider_date 
ON appointments(tenant_id, provider_id, start_time);

CREATE INDEX CONCURRENTLY idx_customers_tenant_email 
ON customers(tenant_id, email);

-- Analyze tables for query planning
ANALYZE appointments;
ANALYZE customers;
ANALYZE providers;
```

### CDN Configuration

Configure CDN for static assets:

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-cdn.com'],
  },
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.yourdomain.com' 
    : undefined,
}

export default nextConfig
```

## Security Hardening

### Environment-Specific Settings

```typescript
// Production-only security headers
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }))
}
```

### Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function rateLimitMiddleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
}
```

## Post-Deployment Checklist

After deployment:

- [ ] **SSL Certificate**: Verify HTTPS is working
- [ ] **Health Checks**: Confirm all endpoints respond correctly
- [ ] **Database**: Verify migrations completed successfully
- [ ] **Monitoring**: Check all monitoring systems are active
- [ ] **Backups**: Confirm backup automation is working
- [ ] **Performance**: Run load tests on critical endpoints
- [ ] **Security**: Perform security scan
- [ ] **Documentation**: Update deployment documentation

---

Your Sloty deployment is now ready for production! 🎉

For ongoing maintenance, see [Development Guide](/docs/development/setup).
