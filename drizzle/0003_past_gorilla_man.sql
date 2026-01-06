CREATE TABLE "rewardsMembers" (
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
--> statement-breakpoint
CREATE TABLE "rewardsTransactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"memberId" integer NOT NULL,
	"orderId" integer,
	"points" integer NOT NULL,
	"description" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "rewardsTier";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "rewardsPoints";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "isRewardsMember";