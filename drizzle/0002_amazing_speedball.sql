CREATE TYPE "public"."rewardsTier" AS ENUM('bronze', 'silver', 'gold', 'platinum');--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "rewardsTier" "rewardsTier" DEFAULT 'bronze';--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "rewardsPoints" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "isRewardsMember" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "orderItems" ADD COLUMN "costCentsAtPurchase" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "isApproved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "approvedBy" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "approvedAt" timestamp;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "costCents" integer;