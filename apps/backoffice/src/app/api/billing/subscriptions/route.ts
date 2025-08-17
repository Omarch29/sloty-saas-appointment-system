import { NextRequest, NextResponse } from 'next/server'
import { db } from '@sloty/db'
import { z } from 'zod'

const createSubscriptionSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  pricePlanId: z.string().min(1, 'Price plan ID is required'),
  status: z.enum(['trialing', 'active']).default('trialing'),
  billingCycleAnchor: z.string().datetime(),
  trialEnd: z.string().datetime().nullable()
})

export async function GET() {
  try {
    const subscriptions = await db.subscription.findMany({
      include: {
        tenant: { select: { id: true, name: true, status: true } },
        product: { select: { id: true, name: true } },
        pricePlan: { 
          select: { 
            id: true, 
            name: true, 
            priceCents: true, 
            billingCycle: true,
            includesSeats: true,
            includesAppointmentsPerMonth: true
          } 
        },
        invoices: {
          select: { id: true, status: true, totalCents: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createSubscriptionSchema.parse(body)

    // Verify tenant exists and is active
    const tenant = await db.tenant.findUnique({
      where: { id: validatedData.tenantId }
    })

    if (!tenant) {
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 }
      )
    }

    if (tenant.status !== 'active') {
      return NextResponse.json(
        { message: 'Tenant must be active to create subscription' },
        { status: 400 }
      )
    }

    // Verify product and price plan exist
    const product = await db.product.findUnique({
      where: { id: validatedData.productId },
      include: {
        pricePlans: {
          where: { id: validatedData.pricePlanId }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.pricePlans.length === 0) {
      return NextResponse.json(
        { message: 'Price plan not found' },
        { status: 404 }
      )
    }

    // Check if tenant already has an active subscription
    const existingSubscription = await db.subscription.findFirst({
      where: {
        tenantId: validatedData.tenantId,
        status: { in: ['active', 'trialing'] }
      }
    })

    if (existingSubscription) {
      return NextResponse.json(
        { message: 'Tenant already has an active subscription' },
        { status: 400 }
      )
    }

    // Create subscription
    const subscription = await db.subscription.create({
      data: {
        tenantId: validatedData.tenantId,
        productId: validatedData.productId,
        pricePlanId: validatedData.pricePlanId,
        status: validatedData.status,
        billingCycleAnchor: new Date(validatedData.billingCycleAnchor),
        trialEnd: validatedData.trialEnd ? new Date(validatedData.trialEnd) : null
      },
      include: {
        tenant: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
        pricePlan: { select: { id: true, name: true, priceCents: true, billingCycle: true } }
      }
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)

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
