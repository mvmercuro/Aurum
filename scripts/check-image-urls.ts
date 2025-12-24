
import { getDb } from '../lib/db';
import { products } from '../drizzle/schema';
import dotenv from 'dotenv';
dotenv.config();

async function checkUrls() {
    const db = await getDb();
    if (!db) {
        console.error("Database connection failed");
        process.exit(1);
    }

    const allProducts = await db.select().from(products);
    const invalid = [];

    console.log(`Checking ${allProducts.length} products...`);

    for (const p of allProducts) {
        if (p.imageUrl && !p.imageUrl.includes('jktgrilntsyjckczbpkd.supabase.co') && !p.imageUrl.startsWith('/')) {
            invalid.push({ id: p.id, url: p.imageUrl });
        }
    }

    if (invalid.length > 0) {
        console.error("Found invalid image URLs:", invalid);
        process.exit(1);
    } else {
        console.log("All image URLs are valid (local or specific supabase domain).");
    }
    process.exit(0);
}

checkUrls().catch(console.error);
