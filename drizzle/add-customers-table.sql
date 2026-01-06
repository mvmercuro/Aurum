-- Add customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(320),
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2) DEFAULT 'CA',
    zip VARCHAR(10),
    notes TEXT,
    "totalOrders" INTEGER DEFAULT 0,
    "lifetimeValueCents" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Add customer_id to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS "customerId" INTEGER REFERENCES customers(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders("customerId");
