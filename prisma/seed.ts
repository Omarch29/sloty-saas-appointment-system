import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create a demo tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { id: 'demo-tenant-id' },
    update: {},
    create: {
      id: 'demo-tenant-id',
      name: 'Demo Medical Clinic',
      legalName: 'Demo Medical Clinic LLC',
      billingEmail: 'billing@democlinic.com',
      timezone: 'America/New_York',
      defaultCurrency: 'USD',
      status: 'active',
    },
  })

  // Create a demo admin user
  const adminUser = await prisma.user.upsert({
    where: { 
      tenantId_email: {
        tenantId: demoTenant.id,
        email: 'admin@democlinic.com'
      }
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      email: 'admin@democlinic.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    },
  })

  // Create a demo location
  const demoLocation = await prisma.location.upsert({
    where: { id: 'demo-location-id' },
    update: {},
    create: {
      id: 'demo-location-id',
      tenantId: demoTenant.id,
      name: 'Main Office',
      addressLine1: '123 Demo Street',
      city: 'Demo City',
      region: 'DC',
      postalCode: '12345',
      countryCode: 'US',
      timezone: 'America/New_York',
      isActive: true,
    },
  })

  // Create specialties
  const generalSpecialty = await prisma.specialty.upsert({
    where: { id: 'general-specialty-id' },
    update: {},
    create: {
      id: 'general-specialty-id',
      tenantId: demoTenant.id,
      name: 'General Medicine',
      description: 'General medical consultations and check-ups',
      isActive: true,
    },
  })

  const dentalSpecialty = await prisma.specialty.upsert({
    where: { id: 'dental-specialty-id' },
    update: {},
    create: {
      id: 'dental-specialty-id',
      tenantId: demoTenant.id,
      name: 'Dentistry',
      description: 'Dental care and oral health services',
      isActive: true,
    },
  })

  // Create people (providers and customers)
  const drSmithPerson = await prisma.person.upsert({
    where: { id: 'dr-smith-person-id' },
    update: {},
    create: {
      id: 'dr-smith-person-id',
      tenantId: demoTenant.id,
      firstName: 'John',
      lastName: 'Smith',
      email: 'dr.smith@democlinic.com',
      phone: '(555) 123-4568',
    },
  })

  const drJohnsonPerson = await prisma.person.upsert({
    where: { id: 'dr-johnson-person-id' },
    update: {},
    create: {
      id: 'dr-johnson-person-id',
      tenantId: demoTenant.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'dr.johnson@democlinic.com',
      phone: '(555) 123-4569',
    },
  })

  const clientPerson = await prisma.person.upsert({
    where: { id: 'demo-client-person-id' },
    update: {},
    create: {
      id: 'demo-client-person-id',
      tenantId: demoTenant.id,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@email.com',
      phone: '(555) 987-6543',
    },
  })

  // Create providers
  const drSmithProvider = await prisma.provider.upsert({
    where: { id: drSmithPerson.id },
    update: {},
    create: {
      id: drSmithPerson.id,
      tenantId: demoTenant.id,
      displayName: 'Dr. John Smith',
      licenseNumber: 'MD12345',
      isActive: true,
    },
  })

  const drJohnsonProvider = await prisma.provider.upsert({
    where: { id: drJohnsonPerson.id },
    update: {},
    create: {
      id: drJohnsonPerson.id,
      tenantId: demoTenant.id,
      displayName: 'Dr. Sarah Johnson',
      licenseNumber: 'DDS67890',
      isActive: true,
    },
  })

  // Create customer
  const demoCustomer = await prisma.customer.upsert({
    where: { id: clientPerson.id },
    update: {},
    create: {
      id: clientPerson.id,
      tenantId: demoTenant.id,
      isActive: true,
    },
  })

  // Assign specialties to providers
  await prisma.providerSpecialty.upsert({
    where: {
      providerId_specialtyId: {
        providerId: drSmithProvider.id,
        specialtyId: generalSpecialty.id,
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      providerId: drSmithProvider.id,
      specialtyId: generalSpecialty.id,
    },
  })

  await prisma.providerSpecialty.upsert({
    where: {
      providerId_specialtyId: {
        providerId: drJohnsonProvider.id,
        specialtyId: dentalSpecialty.id,
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      providerId: drJohnsonProvider.id,
      specialtyId: dentalSpecialty.id,
    },
  })

  // Assign providers to location
  await prisma.providerLocation.upsert({
    where: {
      providerId_locationId: {
        providerId: drSmithProvider.id,
        locationId: demoLocation.id,
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      providerId: drSmithProvider.id,
      locationId: demoLocation.id,
    },
  })

  await prisma.providerLocation.upsert({
    where: {
      providerId_locationId: {
        providerId: drJohnsonProvider.id,
        locationId: demoLocation.id,
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      providerId: drJohnsonProvider.id,
      locationId: demoLocation.id,
    },
  })

  // Create services
  const generalConsultation = await prisma.service.upsert({
    where: { id: 'general-consultation-id' },
    update: {},
    create: {
      id: 'general-consultation-id',
      tenantId: demoTenant.id,
      specialtyId: generalSpecialty.id,
      name: 'General Consultation',
      description: '30-minute general medical consultation',
      defaultDurationMinutes: 30,
      defaultCapacity: 1,
      isActive: true,
    },
  })

  const dentalCheckup = await prisma.service.upsert({
    where: { id: 'dental-checkup-id' },
    update: {},
    create: {
      id: 'dental-checkup-id',
      tenantId: demoTenant.id,
      specialtyId: dentalSpecialty.id,
      name: 'Dental Check-up',
      description: '45-minute comprehensive dental examination',
      defaultDurationMinutes: 45,
      defaultCapacity: 1,
      isActive: true,
    },
  })

  // Create provider services with pricing
  await prisma.providerService.upsert({
    where: {
      providerId_serviceId: {
        providerId: drSmithProvider.id,
        serviceId: generalConsultation.id,
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      providerId: drSmithProvider.id,
      serviceId: generalConsultation.id,
      priceCents: 15000, // $150.00
      isActive: true,
    },
  })

  await prisma.providerService.upsert({
    where: {
      providerId_serviceId: {
        providerId: drJohnsonProvider.id,
        serviceId: dentalCheckup.id,
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      providerId: drJohnsonProvider.id,
      serviceId: dentalCheckup.id,
      priceCents: 20000, // $200.00
      isActive: true,
    },
  })

  // Create working hours for providers
  // Dr. Smith - Monday to Friday 9AM-5PM
  const weekdays = [1, 2, 3, 4, 5] // Monday to Friday
  for (const weekday of weekdays) {
    await prisma.providerWorkingHours.upsert({
      where: { 
        id: `dr-smith-hours-${weekday}`
      },
      update: {},
      create: {
        id: `dr-smith-hours-${weekday}`,
        tenantId: demoTenant.id,
        providerId: drSmithProvider.id,
        locationId: demoLocation.id,
        weekday,
        startLocalTime: '09:00',
        endLocalTime: '17:00',
      },
    })
  }

  // Dr. Johnson - Tuesday to Saturday 10AM-6PM  
  const drJohnsonDays = [2, 3, 4, 5, 6] // Tuesday to Saturday
  for (const weekday of drJohnsonDays) {
    await prisma.providerWorkingHours.upsert({
      where: { 
        id: `dr-johnson-hours-${weekday}`
      },
      update: {},
      create: {
        id: `dr-johnson-hours-${weekday}`,
        tenantId: demoTenant.id,
        providerId: drJohnsonProvider.id,
        locationId: demoLocation.id,
        weekday,
        startLocalTime: '10:00',
        endLocalTime: '18:00',
      },
    })
  }

  // Create some sample parameter definitions
  const visitTypeParam = await prisma.parameterDefinition.upsert({
    where: { id: 'visit-type-param-id' },
    update: {},
    create: {
      id: 'visit-type-param-id',
      tenantId: demoTenant.id,
      name: 'Visit Type',
      dataType: 'enum',
      scope: 'appointment',
      isRequired: true,
      helpText: 'Type of medical visit',
    },
  })

  // Create parameter options for visit type
  await prisma.parameterOption.upsert({
    where: { id: 'visit-type-routine-id' },
    update: {},
    create: {
      id: 'visit-type-routine-id',
      tenantId: demoTenant.id,
      parameterId: visitTypeParam.id,
      value: 'routine',
      label: 'Routine Check-up',
      sortOrder: 1,
    },
  })

  await prisma.parameterOption.upsert({
    where: { id: 'visit-type-followup-id' },
    update: {},
    create: {
      id: 'visit-type-followup-id',
      tenantId: demoTenant.id,
      parameterId: visitTypeParam.id,
      value: 'followup',
      label: 'Follow-up Visit',
      sortOrder: 2,
    },
  })

  // Create a sample booking rule
  await prisma.bookingRule.upsert({
    where: { id: 'default-booking-rule-id' },
    update: {},
    create: {
      id: 'default-booking-rule-id',
      tenantId: demoTenant.id,
      serviceId: null, // Default for all services
      minNoticeMinutes: 60, // 1 hour minimum notice
      maxHorizonDays: 90, // 90 days in advance
      cancelCutoffMinutes: 60, // 1 hour before appointment
      allowDoubleBook: false,
    },
  })

  console.log('Seed completed successfully!')
  console.log('Created:')
  console.log('- Demo tenant:', demoTenant.name)
  console.log('- Demo location:', demoLocation.name)
  console.log('- Admin user:', adminUser.email)
  console.log('- Providers:', drSmithProvider.displayName, drJohnsonProvider.displayName)
  console.log('- Customer:', demoCustomer.id)
  console.log('- Services:', generalConsultation.name, dentalCheckup.name)
  console.log('- Working hours configured for all providers')
  console.log('- Sample parameter definitions and booking rules created')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
