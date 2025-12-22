import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { products } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    
    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const conditions = [eq(products.isActive, true)];
    
    if (categoryId) {
      conditions.push(eq(products.categoryId, parseInt(categoryId)));
    }

    const result = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        priceCents: products.priceCents,
        imageUrl: products.imageUrl,
        categoryId: products.categoryId,
        inventoryCount: products.inventoryCount,
        thcPercentage: products.thcPercentage,
        cbdPercentage: products.cbdPercentage,
        strainType: products.strainType,
        brand: products.brand,
        weight: products.weight,
        effects: products.effects,
      })
      .from(products)
      .where(and(...conditions));

    // Parse effects JSON string to array
    const parsedProducts = result.map((p: any) => ({
      ...p,
      effects: p.effects ? JSON.parse(p.effects) : [],
    }));

    return NextResponse.json(parsedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
