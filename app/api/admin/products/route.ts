import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { products } from '@/drizzle/schema';
import { isAdmin } from '@/lib/auth';
import { desc } from 'drizzle-orm';

export async function GET() {
    try {
        const isUserAdmin = await isAdmin();
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDb();
        if (!db) {
            return NextResponse.json(
                { error: 'Database not available' },
                { status: 503 }
            );
        }

        const result = await db
            .select()
            .from(products)
            .orderBy(desc(products.id));

        // Parse effects JSON string to array if needed, though admin UI might expect raw or parsed
        // The previous public API parsed it. Let's parse it for consistency.
        const parsedProducts = result.map((p) => ({
            ...p,
            effects: p.effects ? JSON.parse(p.effects as string) : [],
        }));

        return NextResponse.json(parsedProducts);
    } catch (error) {
        console.error('Error fetching admin products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const isUserAdmin = await isAdmin();
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDb();
        if (!db) {
            return NextResponse.json(
                { error: 'Database not available' },
                { status: 503 }
            );
        }

        const body = await request.json();

        // Basic validation could go here

        const result = await db.insert(products).values({
            ...body,
            effects: JSON.stringify(body.effects || []),
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
