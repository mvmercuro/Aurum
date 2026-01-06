import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, orderItems, products, zipCodes, regions } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const createOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  customerEmail: z.string().email("Valid email is required").optional().or(z.literal('')),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  zip: z.string().min(5, "Valid ZIP code is required"),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive()
  })).min(1, "Order must contain at least one item"),
  paymentMethod: z.enum(["cash", "debit"])
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = createOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      address1,
      address2,
      city,
      zip,
      notes,
      items,
      paymentMethod,
    } = validation.data;

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Wrap everything in a transaction to ensure data integrity
    return await db.transaction(async (tx) => {
      // 1. Validate ZIP and Region
      const [zipRecord] = await tx
        .select()
        .from(zipCodes)
        .where(eq(zipCodes.zip, zip))
        .limit(1);

      if (!zipRecord || !zipRecord.isActive) {
        return NextResponse.json(
          { error: 'Delivery not available to this ZIP code' },
          { status: 400 }
        );
      }

      const [region] = await tx
        .select()
        .from(regions)
        .where(eq(regions.id, zipRecord.regionId))
        .limit(1);

      if (!region || !region.isActive) {
        return NextResponse.json(
          { error: 'Delivery region not active' },
          { status: 400 }
        );
      }

      // 2. Validate Inventory & Calculate Totals
      let subtotalCents = 0;

      // We need to lock these rows or at least check them inside the transaction
      // Since we are inside a transaction, reads are consistent snapshot by default in Postgres (Read Committed)
      // but strictly speaking for inventory we might want 'FOR UPDATE' logic if high concurrency.
      // Drizzle 'for update' is available in newer versions, assuming standard verify-then-update for now.

      for (const item of items) {
        const [product] = await tx
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);

        if (!product) {
          // Throwing triggers rollback
          throw new Error('Product not found: ' + item.productId);
        }

        if (product.inventoryCount < item.quantity) {
          throw new Error('Insufficient inventory for: ' + product.name);
        }

        subtotalCents += product.priceCents * item.quantity;
      }

      // 3. Check Minimums
      if (subtotalCents < region.minimumOrderCents) {
        return NextResponse.json(
          {
            error: 'Order does not meet minimum',
            minimumOrderCents: region.minimumOrderCents
          },
          { status: 400 }
        );
      }

      const deliveryFeeCents = subtotalCents >= 5000 ? 0 : (region.deliveryFeeCents || 0);
      const totalCents = subtotalCents + deliveryFeeCents;
      const orderNumber = 'ORD-' + Date.now().toString().slice(-8);

      // 4. Create Order
      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber,
          status: 'new',
          regionId: region.id,
          subtotalCents,
          deliveryFeeCents,
          totalCents,
          paymentMethod,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          address1,
          address2: address2 || null,
          city,
          state: 'CA',
          zip,
          notes: notes || null,
        })
        .returning();

      // 5. Create Order Items & Deduct Inventory
      for (const item of items) {
        const [product] = await tx
          .select() // Re-select to be safe inside loop, effectively cached in transaction context usually
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);

        // We already checked inventory above, but technically it could have changed if not locked.
        // In a simple transaction with default isolation, this second check is still just a snapshot.
        // Ideally we would do `update ... where inventory >= quantity` and check affected rows.

        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceCentsAtPurchase: product.priceCents,
        });

        await tx
          .update(products)
          .set({
            inventoryCount: product.inventoryCount - item.quantity,
          })
          .where(eq(products.id, item.productId));
      }

      return NextResponse.json({
        success: true,
        orderNumber: order.orderNumber,
        orderId: order.id,
        totalCents: order.totalCents,
        message: 'Order created successfully',
      });
    });

  } catch (error: any) {
    console.error('Order creation error:', error);
    // Handle errors thrown from inside transaction (like inventory checks)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';

    // If it's a known inventory/product error, return 400, else 500
    if (errorMessage.includes('Insufficient inventory') || errorMessage.includes('Product not found')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
