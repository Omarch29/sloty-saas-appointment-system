import { NextRequest, NextResponse } from 'next/server'
import { db } from '@sloty/db'
import { z } from 'zod'

const createTenantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  legalName: z.string().optional(),
  billingEmail: z.string().email().optional().or(z.literal('')),
  timezone: z.string().min(1, 'Timezone is required'),
  defaultCurrency: z.string().min(3, 'Currency is required'),
  status: z.enum(['active', 'suspended', 'inactive']).default('active')
})

export async function GET() {
  try {
    const tenants = await db.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        users: {
          where: { role: 'admin' },
          select: { id: true, email: true, firstName: true, lastName: true }
        },
        _count: {
          select: { users: true, appointments: true }
        }
      }
    })

    return NextResponse.json(tenants)
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createTenantSchema.parse(body)

    // Convert empty string to null for optional email field
    const tenantData = {
      ...validatedData,
      billingEmail: validatedData.billingEmail || null,
      legalName: validatedData.legalName || null
    }

    const tenant = await db.tenant.create({
      data: tenantData,
      include: {
        _count: {
          select: { users: true, appointments: true }
        }
      }
    })

    return NextResponse.json(tenant, { status: 201 })
  } catch (error) {
    console.error('Error creating tenant:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
