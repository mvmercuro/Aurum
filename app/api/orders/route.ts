import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, orderItems, products, zipCodes, regions } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    } = body;

    if (!customerName || !customerPhone || !address1 || !city || !zip || !items || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }

    const [zipRecord] = await db
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

    const [region] = await db
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

    let subtotalCents = 0;
    for (const item of items) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found: ' + item.productId },
          { status: 400 }
        );
      }

      if (product.inventoryCount < item.quantity) {
        return NextResponse.json(
          { error: 'Insufficient inventory for: ' + product.name },
          { status: 400 }
        );
      }

      subtotalCents += product.priceCents * item.quantity;
    }

    if (subtotalCents < region.minimumOrderCents) {
      return NextResponse.json(
        { 
          error: 'Order does not meet minimum',
          minimumOrderCents: region.minimumOrderCents 
        },
        { status: 400 }
      );
    }

    const deliveryFeeCents = subtotalCents >= 5000 ? 0 : region.deliveryFeeCents;
    const totalCents = subtotalCents + deliveryFeeCents;

    const orderNumber = 'ORD-' + Date.now().toString().slice(-8);

    const [order] = await db
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
        customerEmail,
        address1,
        address2,
        city,
        state: 'CA',
        zip,
        notes,
      })
      .returning();

    for (const item of items) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceCentsAtPurchase: product.priceCents,
      });

      await db
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
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
