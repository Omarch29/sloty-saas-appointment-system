import { NextRequest, NextResponse } from 'next/server'
import { db } from '@sloty/db'
import { z } from 'zod'

const updateTenantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  legalName: z.string().optional(),
  billingEmail: z.string().email().optional().or(z.literal('')),
  timezone: z.string().min(1, 'Timezone is required'),
  defaultCurrency: z.string().min(3, 'Currency is required'),
  status: z.enum(['active', 'suspended', 'inactive'])
})

interface Params {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const tenant = await db.tenant.findUnique({
      where: { id: params.id },
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

    if (!tenant) {
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error('Error fetching tenant:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json()
    const validatedData = updateTenantSchema.parse(body)

    // Check if tenant exists
    const existingTenant = await db.tenant.findUnique({
      where: { id: params.id }
    })

    if (!existingTenant) {
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Convert empty string to null for optional fields
    const tenantData = {
      ...validatedData,
      billingEmail: validatedData.billingEmail || null,
      legalName: validatedData.legalName || null
    }

    const tenant = await db.tenant.update({
      where: { id: params.id },
      data: tenantData,
      include: {
        _count: {
          select: { users: true, appointments: true }
        }
      }
    })

    return NextResponse.json(tenant)
  } catch (error) {
    console.error('Error updating tenant:', error)

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

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check if tenant exists
    const existingTenant = await db.tenant.findUnique({
      where: { id: params.id }
    })

    if (!existingTenant) {
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Delete tenant (CASCADE will handle related records)
    await db.tenant.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Tenant deleted successfully' })
  } catch (error) {
    console.error('Error deleting tenant:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
