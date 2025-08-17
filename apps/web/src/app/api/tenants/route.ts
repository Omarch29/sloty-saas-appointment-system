import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        locations: {
          select: {
            id: true,
            name: true,
            city: true,
            isActive: true,
          },
        },
        specialties: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        services: {
          select: {
            id: true,
            name: true,
            defaultDurationMinutes: true,
            isActive: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: tenants,
      count: tenants.length,
    })
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tenants',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
