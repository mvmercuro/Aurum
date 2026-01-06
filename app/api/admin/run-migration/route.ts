import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import postgres from 'postgres';

export async function POST(request: NextRequest) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
    }

    const sql = postgres(connectionString, { prepare: false });

    try {
        // Create customers table
        await sql`
            CREATE TABLE IF NOT EXISTS customers (
                id serial PRIMARY KEY NOT NULL,
                name varchar(255) NOT NULL,
                phone varchar(20) NOT NULL,
                email varchar(320),
                address1 varchar(255),
                address2 varchar(255),
                city varchar(100),
                state varchar(2) DEFAULT 'CA' NOT NULL,
                zip varchar(10),
                notes text,
                "totalOrders" integer DEFAULT 0 NOT NULL,
                "lifetimeValueCents" integer DEFAULT 0 NOT NULL,
                "createdAt" timestamp DEFAULT now() NOT NULL,
                "updatedAt" timestamp DEFAULT now() NOT NULL,
                CONSTRAINT customers_phone_unique UNIQUE(phone)
            )
        `;

        // Add customerId column to orders table
        await sql`
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS "customerId" integer
        `;

        await sql.end();

        return NextResponse.json({
            success: true,
            message: 'Migration completed successfully'
        });
    } catch (error: any) {
        console.error('Migration failed:', error);
        await sql.end();
        return NextResponse.json({
            error: 'Migration failed',
            details: error.message
        }, { status: 500 });
    }
}
