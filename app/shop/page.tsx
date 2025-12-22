import { Layout } from '@/components/Layout';
import { MenuLayout } from '@/components/shop/MenuLayout';
import { getDb } from "@/server/db";
import { products, categories } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const db = await getDb();

  if (!db) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold text-destructive">Database Connection Error</h1>
          <p className="text-muted-foreground">Unable to load products at this time.</p>
        </div>
      </Layout>
    );
  }

  // Fetch products with their category names
  const rows = await db
    .select()
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));

  // Transform to match ProductWithCategory interface
  const formattedProducts = rows.map((row) => {
    let parsedEffects: string[] = [];
    if (row.products.effects) {
      try {
        parsedEffects = JSON.parse(row.products.effects);
      } catch (e) {
        parsedEffects = [];
      }
    }

    return {
      ...row.products,
      effects: parsedEffects,
      category: row.categories ? { name: row.categories.name } : null,
      // Ensure other fields match Product interface if needed
      // Drizzle decimal returns string, which matches API string | null
    };
  });

  return (
    <Layout>
      <MenuLayout products={formattedProducts} />
    </Layout>
  );
}

