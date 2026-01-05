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
        // Handle effects array serialization if present
        const updateData: any = {
            updatedAt: new Date(),
        };

        if (body.name !== undefined) updateData.name = body.name;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.priceCents !== undefined) updateData.priceCents = Math.round(Number(body.priceCents));
        if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
        if (body.categoryId !== undefined) updateData.categoryId = Number(body.categoryId);
        if (body.inventoryCount !== undefined) updateData.inventoryCount = Math.round(Number(body.inventoryCount));
        if (body.isActive !== undefined) updateData.isActive = body.isActive;
        if (body.thcPercentage !== undefined) updateData.thcPercentage = body.thcPercentage ? String(body.thcPercentage) : null;
        if (body.cbdPercentage !== undefined) updateData.cbdPercentage = body.cbdPercentage ? String(body.cbdPercentage) : null;
        if (body.strainType !== undefined) updateData.strainType = body.strainType;
        if (body.brand !== undefined) updateData.brand = body.brand;
        if (body.weight !== undefined) updateData.weight = body.weight;

        if (body.effects !== undefined) {
            let effectsArray: string[] = [];
            if (Array.isArray(body.effects)) {
                effectsArray = body.effects;
            } else if (typeof body.effects === 'string') {
                effectsArray = body.effects.split(',').map((e: string) => e.trim()).filter((e: string) => e.length > 0);
            }
            updateData.effects = JSON.stringify(effectsArray);
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
