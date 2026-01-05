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

        // Strict validation and mapping
        if (!body.name || !body.priceCents || !body.categoryId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Handle effects: ensure it's stored as a JSON string of an array
        let effectsArray: string[] = [];
        if (Array.isArray(body.effects)) {
            effectsArray = body.effects;
        } else if (typeof body.effects === 'string') {
            // Split comma-separated string if provided as string
            effectsArray = body.effects.split(',').map((e: string) => e.trim()).filter((e: string) => e.length > 0);
        }

        const productValues = {
            name: body.name,
            description: body.description || null,
            priceCents: Math.round(Number(body.priceCents)), // Ensure integer
            imageUrl: body.imageUrl || null,
            categoryId: Number(body.categoryId),
            inventoryCount: Math.round(Number(body.inventoryCount) || 0),
            isActive: body.isActive ?? true,
            thcPercentage: body.thcPercentage ? String(body.thcPercentage) : null,
            cbdPercentage: body.cbdPercentage ? String(body.cbdPercentage) : null,
            strainType: body.strainType || null,
            brand: body.brand || null,
            weight: body.weight || null,
            effects: JSON.stringify(effectsArray),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.insert(products).values(productValues).returning();

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
