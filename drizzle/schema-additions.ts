// Add this to your drizzle/schema.ts file
import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

/**
 * Customers table
 */
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 320 }),
  address1: varchar("address1", { length: 255 }),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }).default("CA"),
  zip: varchar("zip", { length: 10 }),
  notes: text("notes"),
  totalOrders: integer("totalOrders").notNull().default(0),
  lifetimeValueCents: integer("lifetimeValueCents").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

// Update orders table to add customerId field
// Add this line to the orders table definition:
// customerId: integer("customerId"),
