import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { zipCodes } from '@/drizzle/schema';
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
        const zipCodeId = parseInt(params.id);

        if (isNaN(zipCodeId)) {
            return NextResponse.json({ error: 'Invalid ZIP code ID' }, { status: 400 });
        }

        await db.delete(zipCodes).where(eq(zipCodes.id, zipCodeId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete ZIP code:', error);
        return NextResponse.json({ error: 'Failed to delete ZIP code' }, { status: 500 });
    }
}
