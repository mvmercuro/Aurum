import { Router } from "express";
import { getDb } from "../db";
import { orders, orderItems, products, drivers, regions, orderAssignments } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

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
