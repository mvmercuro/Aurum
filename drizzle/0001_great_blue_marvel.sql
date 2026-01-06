CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(320),
	"address1" varchar(255),
	"address2" varchar(255),
	"city" varchar(100),
	"state" varchar(2) DEFAULT 'CA' NOT NULL,
	"zip" varchar(10),
	"notes" text,
	"totalOrders" integer DEFAULT 0 NOT NULL,
	"lifetimeValueCents" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customerId" integer;