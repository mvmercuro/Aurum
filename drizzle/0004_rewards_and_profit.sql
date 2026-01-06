-- Add rewards tier enum
DO $$ BEGIN
 CREATE TYPE "rewardsTier" AS ENUM('bronze', 'silver', 'gold', 'platinum');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Add approval fields to orders
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "isApproved" boolean DEFAULT false NOT NULL;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "approvedBy" integer;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "approvedAt" timestamp;

-- Add cost tracking to orderItems
ALTER TABLE "orderItems" ADD COLUMN IF NOT EXISTS "costCentsAtPurchase" integer;

-- Create rewards members table
CREATE TABLE IF NOT EXISTS "rewardsMembers" (
	"id" serial PRIMARY KEY NOT NULL,
	"customerId" integer NOT NULL,
	"tier" "rewardsTier" DEFAULT 'bronze' NOT NULL,
	"pointsBalance" integer DEFAULT 0 NOT NULL,
	"lifetimePoints" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL,
	"lastActivityAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rewardsMembers_customerId_unique" UNIQUE("customerId")
);

-- Create rewards transactions table
CREATE TABLE IF NOT EXISTS "rewardsTransactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"memberId" integer NOT NULL,
	"orderId" integer,
	"points" integer NOT NULL,
	"description" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
