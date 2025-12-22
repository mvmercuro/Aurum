import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { zipCodes, regions } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zip } = body;

    if (!zip) {
      return NextResponse.json(
        { error: 'ZIP code is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }

    const [zipRecord] = await db
      .select()
      .from(zipCodes)
      .where(eq(zipCodes.zip, zip))
      .limit(1);

    if (!zipRecord || !zipRecord.isActive) {
      return NextResponse.json({
        available: false,
        error: 'Delivery not available to this ZIP code',
      });
    }

    const [region] = await db
      .select()
      .from(regions)
      .where(eq(regions.id, zipRecord.regionId))
      .limit(1);

    if (!region || !region.isActive) {
      return NextResponse.json({
        available: false,
        error: 'Delivery region not currently active',
      });
    }

    return NextResponse.json({
      available: true,
      zip: zipRecord.zip,
      regionId: region.id,
      regionName: region.name,
      deliveryFeeCents: region.deliveryFeeCents,
      minimumOrderCents: region.minimumOrderCents,
    });
  } catch (error) {
    console.error('ZIP check error:', error);
    return NextResponse.json(
      { error: 'Failed to check ZIP code' },
      { status: 500 }
    );
  }
}
