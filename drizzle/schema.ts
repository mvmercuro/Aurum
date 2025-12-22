import { integer, pgEnum, pgTable, text, timestamp, varchar, decimal, boolean, serial } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Service regions (SFV, LA, OC)
 */
export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // "SFV", "LA", "OC"
  deliveryFeeCents: integer("deliveryFeeCents").notNull().default(0),
  minimumOrderCents: integer("minimumOrderCents").notNull().default(0),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Region = typeof regions.$inferSelect;
export type InsertRegion = typeof regions.$inferInsert;

/**
 * ZIP codes mapped to regions
 */
export const zipCodes = pgTable("zipCodes", {
  id: serial("id").primaryKey(),
  zip: varchar("zip", { length: 10 }).notNull().unique(),
  regionId: integer("regionId").notNull(),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ZipCode = typeof zipCodes.$inferSelect;
export type InsertZipCode = typeof zipCodes.$inferInsert;

/**
 * Product categories (Flower, Vapes, Edibles, etc.)
 */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  sortOrder: integer("sortOrder").notNull().default(0),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export const strainTypeEnum = pgEnum("strainType", ["indica", "sativa", "hybrid"]);

/**
 * Products (cannabis items)
 */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  priceCents: integer("priceCents").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  categoryId: integer("categoryId").notNull(),
  isActive: boolean("isActive").notNull().default(true),
  inventoryCount: integer("inventoryCount").notNull().default(0),
  // Cannabis-specific fields
  thcPercentage: decimal("thcPercentage", { precision: 5, scale: 2 }),
  cbdPercentage: decimal("cbdPercentage", { precision: 5, scale: 2 }),
  strainType: strainTypeEnum("strainType"),
  brand: varchar("brand", { length: 100 }),
  weight: varchar("weight", { length: 50 }), // "3.5g", "1/8 oz", etc.
  effects: text("effects"), // JSON string of effects array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const orderStatusEnum = pgEnum("status", [
  "new",
  "accepted",
  "preparing",
  "out_for_delivery",
  "delivered",
  "canceled"
]);

export const paymentMethodEnum = pgEnum("paymentMethod", ["cash", "debit"]);

/**
 * Customer orders
 */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("orderNumber", { length: 20 }).notNull().unique(),
  status: orderStatusEnum("status").notNull().default("new"),
  regionId: integer("regionId").notNull(),
  subtotalCents: integer("subtotalCents").notNull(),
  deliveryFeeCents: integer("deliveryFeeCents").notNull(),
  totalCents: integer("totalCents").notNull(),
  paymentMethod: paymentMethodEnum("paymentMethod").notNull(),
  // Customer info
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  // Delivery address
  address1: varchar("address1", { length: 255 }).notNull(),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull().default("CA"),
  zip: varchar("zip", { length: 10 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items (products in each order)
 */
export const orderItems = pgTable("orderItems", {
  id: serial("id").primaryKey(),
  orderId: integer("orderId").notNull(),
  productId: integer("productId").notNull(),
  quantity: integer("quantity").notNull(),
  priceCentsAtPurchase: integer("priceCentsAtPurchase").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Drivers
 */
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = typeof drivers.$inferInsert;

/**
 * Order assignments to drivers
 */
export const orderAssignments = pgTable("orderAssignments", {
  id: serial("id").primaryKey(),
  orderId: integer("orderId").notNull().unique(), // One driver per order
  driverId: integer("driverId").notNull(),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
});

export type OrderAssignment = typeof orderAssignments.$inferSelect;
export type InsertOrderAssignment = typeof orderAssignments.$inferInsert;
