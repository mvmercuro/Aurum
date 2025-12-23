import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { products } from '@/drizzle/schema';
import { isAdmin } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isUserAdmin = await isAdmin();
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const productId = parseInt(id);
        const body = await request.json();
        const { inventoryCount } = body;

        const db = await getDb();
        if (!db) {
            return NextResponse.json(
                { error: 'Database not available' },
                { status: 503 }
            );
        }

        const result = await db
            .update(products)
            .set({
                inventoryCount,
                updatedAt: new Date()
            })
            .where(eq(products.id, productId))
            .returning();

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating inventory:', error);
        return NextResponse.json(
            { error: 'Failed to update inventory' },
            { status: 500 }
        );
    }
}
