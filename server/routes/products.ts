import { Router } from "express";
import { getDb } from "../db.js";
import { products, categories } from "../../drizzle/schema.js";
import { eq, and, sql } from "drizzle-orm";

const router = Router();

/**
 * GET /api/products
 * Get all active products with optional filtering
 */
router.get("/", async (req, res) => {
  try {
    const { categoryId } = req.query;
    
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const conditions = [eq(products.isActive, true)];
    
    if (categoryId) {
      conditions.push(eq(products.categoryId, parseInt(categoryId as string)));
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

    res.json(parsedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const result = await db
      .select()
      .from(products)
      .where(and(eq(products.id, parseInt(id)), eq(products.isActive, true)))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = result[0];
    const parsedProduct = {
      ...product,
      effects: product.effects ? JSON.parse(product.effects) : [],
    };

    res.json(parsedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

/**
 * GET /api/categories
 * Get all active categories
 */
router.get("/categories/all", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.sortOrder);

    res.json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
