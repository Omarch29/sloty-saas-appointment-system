---
sidebar_position: 3
---

# Creating Your First Tenant

Learn how to set up your first tenant organization and configure it for appointment booking.

## Prerequisites

Before creating your first tenant, ensure you have:
- ✅ Completed the [Installation](/docs/getting-started/installation)
- ✅ Set up your [Configuration](/docs/getting-started/configuration)
- ✅ Database is running and migrated
- ✅ All applications are accessible

## Tenant Creation Process

### Step 1: Access Backoffice Admin

Navigate to your backoffice application:

```bash
http://localhost:3000
```

If you're running the development environment, the backoffice should be available at port 3000.

### Step 2: Create Tenant Account

1. **Sign up as Super Admin** (first user becomes super admin)
   - Use a valid email address
   - Create a secure password
   - Complete email verification if enabled

2. **Navigate to Tenant Management**
   - Click on "Tenants" in the sidebar
   - Click "Create New Tenant" button

### Step 3: Tenant Configuration

Fill out the tenant creation form:

```typescript
// Example tenant data
{
  "name": "Acme Medical Clinic",
  "slug": "acme-clinic",              // Used in URLs
  "domain": "appointments.acme.com",  // Optional custom domain
  "adminEmail": "admin@acme.com",
  "adminName": "Dr. Sarah Johnson",
  "subscriptionTier": "PRO",          // FREE, BASIC, PRO, ENTERPRISE
}
```

**Required Fields:**
- **Name**: Your organization name
- **Slug**: URL-friendly identifier (e.g., `acme-clinic`)
- **Admin Email**: Email for the tenant administrator
- **Admin Name**: Name of the primary admin user

**Optional Fields:**
- **Custom Domain**: Your own domain for booking
- **Subscription Tier**: Billing level (defaults to FREE trial)

### Step 4: Verify Tenant Creation

After creation, verify the tenant is working:

1. **Check Tenant Dashboard**: Visit `http://localhost:3001`
2. **Login with Admin Credentials**: Use the email/password created
3. **Verify Tenant Isolation**: Ensure you only see this tenant's data

## Initial Tenant Setup

### Configure Basic Settings

Once your tenant is created, configure these essential settings:

#### 1. Business Information

```json
{
  "business": {
    "name": "Acme Medical Clinic",
    "phone": "(555) 123-4567",
    "email": "contact@acme.com",
    "website": "https://acme.com",
    "timezone": "America/New_York",
    "currency": "USD",
    "address": {
      "street": "123 Medical Drive",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "US"
    }
  }
}
```

#### 2. Booking Configuration

```json
{
  "booking": {
    "allowCancellation": true,
    "cancellationWindow": 24,        // Hours before appointment
    "requireConfirmation": false,
    "autoApproval": true,
    "defaultDuration": 30,           // Minutes
    "maxAdvanceBooking": 90,         // Days in advance
    "minAdvanceBooking": 2,          // Hours in advance
    "bufferTime": 15                 // Minutes between appointments
  }
}
```

#### 3. Notification Settings

```json
{
  "notifications": {
    "emailReminders": true,
    "smsReminders": false,
    "reminderTimes": [24, 2],        // Hours before appointment
    "confirmationEmail": true,
    "cancellationNotifications": true
  }
}
```

### Create Your First Location

Every tenant needs at least one location:

1. **Navigate to Locations**
2. **Click "Add Location"**
3. **Fill out location details:**

```typescript
{
  name: "Main Office",
  address: "123 Medical Drive, New York, NY 10001",
  phone: "(555) 123-4567",
  email: "mainoffice@acme.com",
  businessHours: {
    monday: { start: "09:00", end: "17:00" },
    tuesday: { start: "09:00", end: "17:00" },
    wednesday: { start: "09:00", end: "17:00" },
    thursday: { start: "09:00", end: "17:00" },
    friday: { start: "09:00", end: "15:00" },
    saturday: "closed",
    sunday: "closed"
  },
  timezone: "America/New_York"
}
```

### Add Your First Provider

Create a service provider account:

1. **Navigate to Providers**
2. **Click "Add Provider"**
3. **Create provider profile:**

```typescript
{
  // User account details
  email: "dr.johnson@acme.com",
  name: "Dr. Sarah Johnson",
  
  // Provider-specific information
  title: "Dr.",
  specialties: ["Family Medicine", "Internal Medicine"],
  bio: "Dr. Johnson has over 10 years of experience in family medicine...",
  credentials: [
    { type: "MD", institution: "Harvard Medical School", year: 2010 },
    { type: "Board Certified", specialty: "Family Medicine", year: 2014 }
  ],
  
  // Assign to location
  locationId: "location-id-from-above"
}
```

### Configure Services

Create your first bookable service:

1. **Navigate to Services**
2. **Click "Create Service"**
3. **Configure service details:**

```typescript
{
  name: "General Consultation",
  description: "Comprehensive medical consultation and examination",
  category: "Medical",
  duration: 30,                    // Minutes
  bufferTime: 15,                  // Minutes between appointments
  price: 150.00,                   // Optional pricing
  currency: "USD",
  maxAdvanceBooking: 90,           // Days
  minAdvanceBooking: 4,            // Hours
  requiresApproval: false,         // Auto-approve bookings
  isActive: true,
  
  // Collect additional information
  parameters: [
    {
      name: "reason",
      label: "Reason for visit",
      type: "TEXTAREA",
      required: true,
      description: "Please describe the reason for your visit"
    },
    {
      name: "insurance",
      label: "Insurance Provider",
      type: "SELECT",
      required: false,
      options: ["Blue Cross Blue Shield", "Aetna", "Cigna", "Self-Pay"]
    },
    {
      name: "medications",
      label: "Current Medications",
      type: "TEXT",
      required: false,
      description: "List any medications you're currently taking"
    }
  ]
}
```

## Testing Your Setup

### Verify Tenant Booking Flow

Test the complete booking experience:

#### 1. Access Booking Interface

Visit your tenant's booking page:
```
http://localhost:3002/acme-clinic
```

#### 2. Complete Booking Flow

1. **Select Service**: Choose "General Consultation"
2. **Choose Provider**: Select "Dr. Sarah Johnson"
3. **Pick Date/Time**: Select available slot
4. **Fill Parameters**: Complete reason for visit, insurance, etc.
5. **Enter Contact Info**: Provide customer details
6. **Confirm Booking**: Review and submit

#### 3. Verify in Admin Dashboard

Check the appointment appears in:
- Provider dashboard (`http://localhost:3001`)
- Today's schedule view
- Appointment management section

### Test Multi-Tenant Isolation

Verify tenant isolation is working:

1. **Create Second Test Tenant** (optional)
2. **Login to Each Tenant** separately
3. **Confirm Data Isolation**: Each tenant only sees their own data

## Customization Options

### Branding Configuration

Customize your tenant's appearance:

```json
{
  "branding": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#64748b",
    "logo": "https://your-cdn.com/logo.png",
    "favicon": "https://your-cdn.com/favicon.ico",
    "fontFamily": "Inter, sans-serif"
  }
}
```

### Custom Domain Setup

If using a custom domain:

1. **DNS Configuration**: Point your domain to your server
2. **SSL Certificate**: Set up HTTPS certificate
3. **Update Tenant Settings**: Add domain to tenant configuration
4. **Test Access**: Verify `https://appointments.acme.com` works

### Email Templates

Customize notification templates:

```html
<!-- Appointment Confirmation Template -->
<h2>Appointment Confirmed</h2>
<p>Dear {{customerName}},</p>
<p>Your appointment has been confirmed:</p>
<ul>
  <li><strong>Service:</strong> {{serviceName}}</li>
  <li><strong>Provider:</strong> {{providerName}}</li>
  <li><strong>Date:</strong> {{appointmentDate}}</li>
  <li><strong>Time:</strong> {{appointmentTime}}</li>
  <li><strong>Location:</strong> {{locationName}}</li>
</ul>
<p>If you need to cancel or reschedule, please contact us at {{tenantPhone}}.</p>
```

## Common Issues & Solutions

### Tenant Creation Issues

**Issue**: "Slug already exists" error
```bash
✗ Error: Tenant slug 'acme' is already taken
```
**Solution**: Choose a unique slug or add numbers/hyphens

**Issue**: Email validation errors
```bash
✗ Error: Invalid email format
```
**Solution**: Ensure email follows proper format (name@domain.com)

### Access Issues

**Issue**: Can't access tenant dashboard
**Solution**: 
1. Check if tenant app is running on port 3001
2. Verify tenant slug in URL
3. Clear browser cache and cookies

**Issue**: Booking page shows "Tenant not found"
**Solution**:
1. Verify tenant slug in URL matches database
2. Check tenant status is "ACTIVE"
3. Restart booking application

### Configuration Issues

**Issue**: Appointments not appearing
**Solution**:
1. Verify provider is assigned to location
2. Check service is active and properly configured
3. Confirm provider availability is set up

## Next Steps

After setting up your first tenant:

1. **Configure Provider Schedules**: Set up detailed availability
2. **Create More Services**: Add additional service offerings
3. **Set Up Notifications**: Configure email/SMS providers
4. **Test Booking Flow**: Complete end-to-end testing
5. **Train Staff**: Provide access and training to staff members
6. **Go Live**: Start accepting real bookings!

## Production Considerations

Before going live:

- [ ] **Security Review**: Ensure all security measures are in place
- [ ] **Backup Strategy**: Set up automated database backups
- [ ] **Monitoring**: Configure application monitoring
- [ ] **SSL Certificate**: Ensure HTTPS is properly configured
- [ ] **Performance Testing**: Test under expected load
- [ ] **Staff Training**: Train all users on the system

---

Ready to deploy? Continue with [Deployment Guide](/docs/getting-started/deployment).
