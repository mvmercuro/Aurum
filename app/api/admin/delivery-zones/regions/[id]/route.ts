import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { regions } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { isAdmin } from '@/lib/auth';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    if (!db) {
        return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    try {
        const regionId = parseInt(params.id);

        if (isNaN(regionId)) {
            return NextResponse.json({ error: 'Invalid region ID' }, { status: 400 });
        }

        await db.delete(regions).where(eq(regions.id, regionId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete region:', error);
        return NextResponse.json({ error: 'Failed to delete region' }, { status: 500 });
    }
}
