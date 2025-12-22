CREATE TYPE "public"."status" AS ENUM('new', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."paymentMethod" AS ENUM('cash', 'debit');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."strainType" AS ENUM('indica', 'sativa', 'hybrid');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orderAssignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"orderId" integer NOT NULL,
	"driverId" integer NOT NULL,
	"assignedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orderAssignments_orderId_unique" UNIQUE("orderId")
);
--> statement-breakpoint
CREATE TABLE "orderItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"orderId" integer NOT NULL,
	"productId" integer NOT NULL,
	"quantity" integer NOT NULL,
	"priceCentsAtPurchase" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"orderNumber" varchar(20) NOT NULL,
	"status" "status" DEFAULT 'new' NOT NULL,
	"regionId" integer NOT NULL,
	"subtotalCents" integer NOT NULL,
	"deliveryFeeCents" integer NOT NULL,
	"totalCents" integer NOT NULL,
	"paymentMethod" "paymentMethod" NOT NULL,
	"customerName" varchar(255) NOT NULL,
	"customerPhone" varchar(20) NOT NULL,
	"customerEmail" varchar(320),
	"address1" varchar(255) NOT NULL,
	"address2" varchar(255),
	"city" varchar(100) NOT NULL,
	"state" varchar(2) DEFAULT 'CA' NOT NULL,
	"zip" varchar(10) NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_orderNumber_unique" UNIQUE("orderNumber")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"priceCents" integer NOT NULL,
	"imageUrl" varchar(500),
	"categoryId" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"inventoryCount" integer DEFAULT 0 NOT NULL,
	"thcPercentage" numeric(5, 2),
	"cbdPercentage" numeric(5, 2),
	"strainType" "strainType",
	"brand" varchar(100),
	"weight" varchar(50),
	"effects" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"deliveryFeeCents" integer DEFAULT 0 NOT NULL,
	"minimumOrderCents" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "regions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "zipCodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"zip" varchar(10) NOT NULL,
	"regionId" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "zipCodes_zip_unique" UNIQUE("zip")
);
