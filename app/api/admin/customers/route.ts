import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { customers } from '@/drizzle/schema';
import { desc, like, or } from 'drizzle-orm';
import { isAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    if (!db) {
        return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search');

        let query = db.select().from(customers);

        // If search parameter provided, filter by name or phone
        if (search) {
            query = query.where(
                or(
                    like(customers.name, `%${search}%`),
                    like(customers.phone, `%${search}%`)
                )
            ) as any;
        }

        const allCustomers = await query.orderBy(desc(customers.id));

        return NextResponse.json(allCustomers);
    } catch (error) {
        console.error('Failed to fetch customers:', error);
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    if (!db) {
        return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    try {
        const body = await request.json();
        const { name, phone, email, address1, address2, city, state, zip, notes } = body;

        if (!name || !phone) {
            return NextResponse.json(
                { error: 'Name and phone are required' },
                { status: 400 }
            );
        }

        const [newCustomer] = await db
            .insert(customers)
            .values({
                name,
                phone,
                email: email || null,
                address1: address1 || null,
                address2: address2 || null,
                city: city || null,
                state: state || 'CA',
                zip: zip || null,
                notes: notes || null,
                totalOrders: 0,
                lifetimeValueCents: 0,
            })
            .returning();

        return NextResponse.json(newCustomer);
    } catch (error: any) {
        console.error('Failed to create customer:', error);

        // Check for unique constraint violation on phone
        if (error?.code === '23505') {
            return NextResponse.json(
                { error: 'A customer with this phone number already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
}
