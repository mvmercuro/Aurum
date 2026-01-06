import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { rewardsMembers, customers } from '@/drizzle/schema';
import { isAdmin } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const isUserAdmin = await isAdmin();
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDb();
        if (!db) {
            return NextResponse.json(
                { error: 'Database not available' },
                { status: 503 }
            );
        }

        // Get all rewards members with customer details
        const members = await db
            .select({
                id: rewardsMembers.id,
                customerId: rewardsMembers.customerId,
                tier: rewardsMembers.tier,
                pointsBalance: rewardsMembers.pointsBalance,
                lifetimePoints: rewardsMembers.lifetimePoints,
                isActive: rewardsMembers.isActive,
                joinedAt: rewardsMembers.joinedAt,
                lastActivityAt: rewardsMembers.lastActivityAt,
                customerName: customers.name,
                customerPhone: customers.phone,
                customerEmail: customers.email,
                lifetimeValueCents: customers.lifetimeValueCents,
                totalOrders: customers.totalOrders,
            })
            .from(rewardsMembers)
            .leftJoin(customers, eq(rewardsMembers.customerId, customers.id))
            .orderBy(desc(rewardsMembers.lifetimePoints));

        return NextResponse.json(members);
    } catch (error) {
        console.error('Error fetching rewards members:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rewards members' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const isUserAdmin = await isAdmin();
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { customerId } = body;

        if (!customerId) {
            return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
        }

        const db = await getDb();
        if (!db) {
            return NextResponse.json(
                { error: 'Database not available' },
                { status: 503 }
            );
        }

        // Create new rewards member
        const result = await db
            .insert(rewardsMembers)
            .values({
                customerId: Number(customerId),
                tier: 'bronze',
                pointsBalance: 0,
                lifetimePoints: 0,
                isActive: true,
            })
            .returning();

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error creating rewards member:', error);
        return NextResponse.json(
            { error: 'Failed to create rewards member' },
            { status: 500 }
        );
    }
}
