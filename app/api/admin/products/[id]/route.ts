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

        const db = await getDb();
        if (!db) {
            return NextResponse.json(
                { error: 'Database not available' },
                { status: 503 }
            );
        }

        // Handle effects array serialization if present
        const updateData = {
            ...body,
            updatedAt: new Date(),
        };

        if (body.effects) {
            updateData.effects = JSON.stringify(body.effects);
        }

        const result = await db
            .update(products)
            .set(updateData)
            .where(eq(products.id, productId))
            .returning();

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}


export async function DELETE(
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

        const db = await getDb();
        if (!db) {
            return NextResponse.json(
                { error: 'Database not available' },
                { status: 503 }
            );
        }

        await db.delete(products).where(eq(products.id, productId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
