import { NextRequest, NextResponse } from 'next/server'
import { db } from '@sloty/db'
import { z } from 'zod'
import { randomBytes } from 'crypto'

const inviteUserSchema = z.object({
  email: z.string().email('Valid email is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['admin', 'staff', 'viewer']).default('staff')
})

interface Params {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const tenantId = params.id
    const body = await request.json()
    const validatedData = inviteUserSchema.parse(body)

    // Check if tenant exists
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId }
    })

    if (!tenant) {
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        tenantId,
        email: validatedData.email
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists in this tenant' },
        { status: 400 }
      )
    }

    // Generate invite token
    const inviteToken = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    // Create user with pending status
    const user = await db.user.create({
      data: {
        tenantId,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
        isActive: false, // Will be activated when they set password
        // Store invite token in a field (we'll add this to the schema or use a separate table in production)
      }
    })

    // In a real application, you'd store the invite token in a separate table
    // and send an email. For now, we'll return the invite URL
    const inviteUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/invite/${inviteToken}?email=${encodeURIComponent(validatedData.email)}&tenant=${tenantId}`

    // TODO: Send email in production
    console.log(`Invite sent to ${validatedData.email}:`, inviteUrl)

    return NextResponse.json({
      user,
      inviteUrl,
      message: 'Invitation sent successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error sending invitation:', error)

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
