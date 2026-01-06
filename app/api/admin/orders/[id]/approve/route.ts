import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders } from '@/drizzle/schema';
import { isAdmin, getUserId } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isUserAdmin = await isAdmin();
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = await getUserId();
        const { id } = await params;
        const orderId = parseInt(id);

        const db = await getDb();
        if (!db) {
            return NextResponse.json(
                { error: 'Database not available' },
                { status: 503 }
            );
        }

        // Update order to approved
        const result = await db
            .update(orders)
            .set({
                isApproved: true,
                approvedBy: userId,
                approvedAt: new Date(),
                status: 'accepted', // Move to accepted status
                updatedAt: new Date(),
            })
            .where(eq(orders.id, orderId))
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error approving order:', error);
        return NextResponse.json(
            { error: 'Failed to approve order' },
            { status: 500 }
        );
    }
}
