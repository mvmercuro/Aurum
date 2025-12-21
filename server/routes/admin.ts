import { Router } from "express";
import { getDb } from "../db";
import { orders, orderItems, products, drivers, regions, orderAssignments } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import multer from "multer";
import { storagePut } from "../storage";
import crypto from "crypto";

const router = Router();

// Get all orders with details
router.get("/orders", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const allOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerName: orders.customerName,
        customerPhone: orders.customerPhone,
        address1: orders.address1,
        address2: orders.address2,
        city: orders.city,
        zip: orders.zip,
        status: orders.status,
        subtotalCents: orders.subtotalCents,
        deliveryFeeCents: orders.deliveryFeeCents,
        totalCents: orders.totalCents,
        paymentMethod: orders.paymentMethod,
        notes: orders.notes,
        createdAt: orders.createdAt,
        regionName: regions.name,
      })
      .from(orders)
      .leftJoin(regions, eq(orders.regionId, regions.id))
      .orderBy(desc(orders.createdAt));

    // Get items for each order
    const ordersWithItems = await Promise.all(
      allOrders.map(async (order: typeof allOrders[0]) => {
        const items = await db
          .select({
            productId: orderItems.productId,
            productName: products.name,
            quantity: orderItems.quantity,
            priceCentsAtPurchase: orderItems.priceCentsAtPurchase,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

        // Get assignment if exists
        const assignment = await db
          .select({
            driverId: orderAssignments.driverId,
            driverName: drivers.name,
            assignedAt: orderAssignments.assignedAt,
          })
          .from(orderAssignments)
          .leftJoin(drivers, eq(orderAssignments.driverId, drivers.id))
          .where(eq(orderAssignments.orderId, order.id))
          .limit(1);

        return {
          ...order,
          items,
          assignment: assignment[0] || null,
        };
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Update order status
router.patch("/orders/:id/status", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, parseInt(id)));

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to update order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Assign driver to order
router.post("/orders/:id/assign", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { id } = req.params;
    const { driverId } = req.body;

    // Check if assignment already exists
    const existing = await db
      .select()
      .from(orderAssignments)
      .where(eq(orderAssignments.orderId, parseInt(id)))
      .limit(1);

    if (existing.length > 0) {
      // Update existing assignment
      await db
        .update(orderAssignments)
        .set({ driverId, assignedAt: new Date() })
        .where(eq(orderAssignments.orderId, parseInt(id)));
    } else {
      // Create new assignment
      await db.insert(orderAssignments).values({
        orderId: parseInt(id),
        driverId,
        assignedAt: new Date(),
      });
    }

    // Update order status to accepted
    await db
      .update(orders)
      .set({ status: "accepted", updatedAt: new Date() })
      .where(eq(orders.id, parseInt(id)));

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to assign driver:", error);
    res.status(500).json({ error: "Failed to assign driver" });
  }
});

// Get all drivers
router.get("/drivers", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const allDrivers = await db
      .select()
      .from(drivers)
      .where(eq(drivers.isActive, true));

    res.json(allDrivers);
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});

// Update product inventory
router.patch("/products/:id/inventory", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { id } = req.params;
    const { inventoryCount } = req.body;

    if (typeof inventoryCount !== "number" || inventoryCount < 0) {
      return res.status(400).json({ error: "Invalid inventory count" });
    }

    // Update inventory and auto-disable if out of stock
    await db
      .update(products)
      .set({
        inventoryCount,
        isActive: inventoryCount > 0,
        updatedAt: new Date(),
      })
      .where(eq(products.id, parseInt(id)));

    res.json({ success: true, inventoryCount });
  } catch (error) {
    console.error("Failed to update inventory:", error);
    res.status(500).json({ error: "Failed to update inventory" });
  }
});

export default router;

// Get all products (including inactive ones for admin)
router.get("/products", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { categories } = await import("../../drizzle/schema");

    const allProducts = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        priceCents: products.priceCents,
        imageUrl: products.imageUrl,
        categoryId: products.categoryId,
        categoryName: categories.name,
        inventoryCount: products.inventoryCount,
        thcPercentage: products.thcPercentage,
        cbdPercentage: products.cbdPercentage,
        strainType: products.strainType,
        brand: products.brand,
        weight: products.weight,
        effects: products.effects,
        isActive: products.isActive,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt));

    res.json(allProducts);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create new product
router.post("/products", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const {
      name,
      description,
      priceCents,
      imageUrl,
      categoryId,
      inventoryCount,
      thcPercentage,
      cbdPercentage,
      strainType,
      brand,
      weight,
      effects,
      isActive,
    } = req.body;

    const result = await db.insert(products).values({
      name,
      description,
      priceCents,
      imageUrl,
      categoryId,
      inventoryCount,
      thcPercentage,
      cbdPercentage,
      strainType,
      brand,
      weight,
      effects,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({ success: true, id: result[0].insertId });
  } catch (error) {
    console.error("Failed to create product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update product
router.patch("/products/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, parseInt(id)));

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to update product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product
router.delete("/products/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { id } = req.params;

    await db.delete(products).where(eq(products.id, parseInt(id)));

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Upload product image
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.post("/products/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Generate unique filename
    const fileExtension = req.file.originalname.split(".").pop();
    const randomSuffix = crypto.randomBytes(8).toString("hex");
    const fileName = `products/${Date.now()}-${randomSuffix}.${fileExtension}`;

    // Upload to S3
    const { url } = await storagePut(
      fileName,
      req.file.buffer,
      req.file.mimetype
    );

    res.json({ success: true, url });
  } catch (error) {
    console.error("Failed to upload image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});
