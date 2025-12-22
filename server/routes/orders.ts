import { Router } from "express";
import { getDb } from "../db.js";
import { orders, orderItems, zipCodes, regions, products } from "../../drizzle/schema.js";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

const router = Router();

/**
 * POST /api/orders/check-zip
 * Validate ZIP code and return region info
 */
router.post("/check-zip", async (req, res) => {
  try {
    const { zip } = req.body;

    if (!zip) {
      return res.status(400).json({ error: "ZIP code is required" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const result = await db
      .select({
        zip: zipCodes.zip,
        regionId: zipCodes.regionId,
        regionName: regions.name,
        deliveryFeeCents: regions.deliveryFeeCents,
        minimumOrderCents: regions.minimumOrderCents,
        isActive: zipCodes.isActive,
      })
      .from(zipCodes)
      .innerJoin(regions, eq(zipCodes.regionId, regions.id))
      .where(and(eq(zipCodes.zip, zip), eq(zipCodes.isActive, true)))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({
        error: "Sorry, we don't deliver to this ZIP code yet",
        available: false
      });
    }

    res.json({
      available: true,
      ...result[0],
    });
  } catch (error) {
    console.error("Error checking ZIP:", error);
    res.status(500).json({ error: "Failed to validate ZIP code" });
  }
});

/**
 * POST /api/orders
 * Create a new delivery request
 */
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      address1,
      address2,
      city,
      zip,
      notes,
      items, // Array of { productId, quantity }
      paymentMethod,
    } = req.body;

    // Validation
    if (!customerName || !customerPhone || !address1 || !city || !zip || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    // Validate ZIP and get region
    const zipResult = await db
      .select({
        regionId: zipCodes.regionId,
        deliveryFeeCents: regions.deliveryFeeCents,
      })
      .from(zipCodes)
      .innerJoin(regions, eq(zipCodes.regionId, regions.id))
      .where(and(eq(zipCodes.zip, zip), eq(zipCodes.isActive, true)))
      .limit(1);

    if (zipResult.length === 0) {
      return res.status(400).json({ error: "Invalid ZIP code for delivery" });
    }

    const { regionId, deliveryFeeCents } = zipResult[0];

    // Calculate subtotal
    let subtotalCents = 0;
    const orderItemsData = [];

    for (const item of items) {
      const productResult = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (productResult.length === 0) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }

      const product = productResult[0];
      const itemTotal = product.priceCents * item.quantity;
      subtotalCents += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        priceCentsAtPurchase: product.priceCents,
      });
    }

    const totalCents = subtotalCents + deliveryFeeCents;
    const orderNumber = `SFV${nanoid(8).toUpperCase()}`;

    // Create order
    const orderResult = await db.insert(orders).values({
      orderNumber,
      status: "new",
      regionId,
      subtotalCents,
      deliveryFeeCents,
      totalCents,
      paymentMethod: paymentMethod || "cash",
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      address1,
      address2: address2 || null,
      city,
      state: "CA",
      zip,
      notes: notes || null,
    }).returning({ id: orders.id });

    const orderId = orderResult[0].id;

    // Create order items
    for (const item of orderItemsData) {
      await db.insert(orderItems).values({
        orderId,
        ...item,
      });
    }

    res.json({
      success: true,
      orderNumber,
      orderId,
      totalCents,
      message: "Delivery request received! We'll contact you shortly to confirm.",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create delivery request" });
  }
});

/**
 * GET /api/orders/:orderNumber
 * Lookup order status by order number and phone
 */
router.get("/:orderNumber", async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const result = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.orderNumber, orderNumber),
          eq(orders.customerPhone, phone as string)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
