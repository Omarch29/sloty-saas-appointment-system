import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createLocationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  region: z.string().min(1, 'Region is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  countryCode: z.string().min(2, 'Country code is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  isActive: z.boolean(),
});

// Mock tenant ID - in real app this would come from auth
const MOCK_TENANT_ID = 'tenant_1';

export async function GET() {
  try {
    // TODO: Replace with actual database call
    // const { db } = await import('@sloty/db');
    // const locations = await db.location.findMany({
    //   where: { tenantId: MOCK_TENANT_ID },
    //   orderBy: { createdAt: 'desc' }
    // });

    // Mock data for now
    const locations = [
      {
        id: '1',
        tenantId: MOCK_TENANT_ID,
        name: 'Downtown Medical Center',
        addressLine1: '123 Main St',
        addressLine2: 'Suite 200',
        city: 'New York',
        region: 'NY',
        postalCode: '10001',
        countryCode: 'US',
        timezone: 'America/New_York',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
    ];

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createLocationSchema.parse(body);

    // TODO: Replace with actual database call
    // const { db } = await import('@sloty/db');
    // const location = await db.location.create({
    //   data: {
    //     ...validatedData,
    //     tenantId: MOCK_TENANT_ID,
    //   }
    // });

    // Mock response for now
    const location = {
      id: Math.random().toString(36).substr(2, 9),
      ...validatedData,
      tenantId: MOCK_TENANT_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({ location }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}
