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
      name: 'Demo Clinic',
      timezone: 'America/New_York',
      defaultCurrency: 'USD',
      status: 'active',
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
      address: '123 Demo Street, Demo City, DC 12345',
      phone: '(555) 123-4567',
      email: 'info@democlinic.com',
      timezone: 'America/New_York',
      status: 'active',
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
      status: 'active',
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
      status: 'active',
    },
  })

  // Create providers
  const drSmith = await prisma.person.upsert({
    where: { id: 'dr-smith-id' },
    update: {},
    create: {
      id: 'dr-smith-id',
      tenantId: demoTenant.id,
      type: 'provider',
      firstName: 'John',
      lastName: 'Smith',
      email: 'dr.smith@democlinic.com',
      phone: '(555) 123-4568',
      status: 'active',
    },
  })

  const drJohnson = await prisma.person.upsert({
    where: { id: 'dr-johnson-id' },
    update: {},
    create: {
      id: 'dr-johnson-id',
      tenantId: demoTenant.id,
      type: 'provider',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'dr.johnson@democlinic.com',
      phone: '(555) 123-4569',
      status: 'active',
    },
  })

  // Assign specialties to providers
  await prisma.providerSpecialty.upsert({
    where: {
      personId_specialtyId: {
        personId: drSmith.id,
        specialtyId: generalSpecialty.id,
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      personId: drSmith.id,
      specialtyId: generalSpecialty.id,
    },
  })

  await prisma.providerSpecialty.upsert({
    where: {
      personId_specialtyId: {
        personId: drJohnson.id,
        specialtyId: dentalSpecialty.id,
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      personId: drJohnson.id,
      specialtyId: dentalSpecialty.id,
    },
  })

  // Create services
  await prisma.service.upsert({
    where: { id: 'general-consultation-id' },
    update: {},
    create: {
      id: 'general-consultation-id',
      tenantId: demoTenant.id,
      specialtyId: generalSpecialty.id,
      name: 'General Consultation',
      description: '30-minute general medical consultation',
      duration: 30,
      price: 150.00,
      status: 'active',
    },
  })

  await prisma.service.upsert({
    where: { id: 'dental-checkup-id' },
    update: {},
    create: {
      id: 'dental-checkup-id',
      tenantId: demoTenant.id,
      specialtyId: dentalSpecialty.id,
      name: 'Dental Check-up',
      description: '45-minute comprehensive dental examination',
      duration: 45,
      price: 200.00,
      status: 'active',
    },
  })

  // Create a demo client
  const demoClient = await prisma.person.upsert({
    where: { id: 'demo-client-id' },
    update: {},
    create: {
      id: 'demo-client-id',
      tenantId: demoTenant.id,
      type: 'client',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@email.com',
      phone: '(555) 987-6543',
      status: 'active',
    },
  })

  // Create a demo user
  await prisma.user.upsert({
    where: { email: 'admin@democlinic.com' },
    update: {},
    create: {
      tenantId: demoTenant.id,
      email: 'admin@democlinic.com',
      name: 'Demo Admin',
      role: 'admin',
      status: 'active',
    },
  })

  console.log('Seed completed successfully!')
  console.log('Demo tenant:', demoTenant.name)
  console.log('Demo location:', demoLocation.name)
  console.log('Providers:', drSmith.firstName + ' ' + drSmith.lastName, drJohnson.firstName + ' ' + drJohnson.lastName)
  console.log('Client:', demoClient.firstName + ' ' + demoClient.lastName)
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
