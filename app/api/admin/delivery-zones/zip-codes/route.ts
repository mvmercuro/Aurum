import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { zipCodes } from '@/drizzle/schema';
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
        const allZipCodes = await db
            .select()
            .from(zipCodes)
            .orderBy(desc(zipCodes.id));

        return NextResponse.json(allZipCodes);
    } catch (error) {
        console.error('Failed to fetch ZIP codes:', error);
        return NextResponse.json({ error: 'Failed to fetch ZIP codes' }, { status: 500 });
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
        const { zip, regionId } = body;

        if (!zip || !regionId) {
            return NextResponse.json(
                { error: 'ZIP code and region are required' },
                { status: 400 }
            );
        }

        const [newZipCode] = await db
            .insert(zipCodes)
            .values({
                zip,
                regionId,
                isActive: true,
            })
            .returning();

        return NextResponse.json(newZipCode);
    } catch (error: any) {
        console.error('Failed to create ZIP code:', error);

        // Check for unique constraint violation
        if (error?.code === '23505') {
            return NextResponse.json(
                { error: 'This ZIP code already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: 'Failed to create ZIP code' }, { status: 500 });
    }
}
