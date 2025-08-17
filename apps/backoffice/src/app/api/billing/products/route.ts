import { NextRequest, NextResponse } from 'next/server'
import { db } from '@sloty/db'
import { z } from 'zod'

const pricePlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  billingCycle: z.enum(['monthly', 'yearly']),
  priceCents: z.number().int().min(0),
  includesSeats: z.number().int().min(1),
  includesAppointmentsPerMonth: z.number().int().min(0).nullable(),
  overagePerAppointmentCents: z.number().int().min(0).nullable(),
  isActive: z.boolean().default(true)
})

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  pricePlans: z.array(pricePlanSchema).min(1, 'At least one price plan is required')
})

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        pricePlans: {
          orderBy: { priceCents: 'asc' }
        },
        _count: {
          select: { subscriptions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    const product = await db.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        isActive: validatedData.isActive,
        pricePlans: {
          create: validatedData.pricePlans.map(plan => ({
            name: plan.name,
            billingCycle: plan.billingCycle,
            priceCents: plan.priceCents,
            includesSeats: plan.includesSeats,
            includesAppointmentsPerMonth: plan.includesAppointmentsPerMonth,
            overagePerAppointmentCents: plan.overagePerAppointmentCents,
            isActive: plan.isActive
          }))
        }
      },
      include: {
        pricePlans: true,
        _count: {
          select: { subscriptions: true }
        }
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)

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
