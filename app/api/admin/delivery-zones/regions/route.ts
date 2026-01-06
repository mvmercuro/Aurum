import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { regions } from '@/drizzle/schema';
import { desc } from 'drizzle-orm';
import { isAdmin } from '@/lib/auth';

export async function GET() {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    if (!db) {
        return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    try {
        const allRegions = await db
            .select()
            .from(regions)
            .orderBy(desc(regions.id));

        return NextResponse.json(allRegions);
    } catch (error) {
        console.error('Failed to fetch regions:', error);
        return NextResponse.json({ error: 'Failed to fetch regions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    if (!db) {
        return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    try {
        const body = await request.json();
        const { name, deliveryFeeCents, minimumOrderCents } = body;

        if (!name || deliveryFeeCents === undefined || minimumOrderCents === undefined) {
            return NextResponse.json(
                { error: 'Name, delivery fee, and minimum order are required' },
                { status: 400 }
            );
        }

        const [newRegion] = await db
            .insert(regions)
            .values({
                name,
                deliveryFeeCents,
                minimumOrderCents,
                isActive: true,
            })
            .returning();

        return NextResponse.json(newRegion);
    } catch (error: any) {
        console.error('Failed to create region:', error);

        // Check for unique constraint violation
        if (error?.code === '23505') {
            return NextResponse.json(
                { error: 'A region with this name already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: 'Failed to create region' }, { status: 500 });
    }
}
