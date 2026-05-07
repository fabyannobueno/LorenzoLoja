import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { customersTable } from "./customers";

export const addressesTable = pgTable("addresses", {
  id: text("id").primaryKey(),
  customer_id: text("customer_id")
    .notNull()
    .references(() => customersTable.id, { onDelete: "cascade" }),
  label: text("label").default("casa"),
  street: text("street").notNull(),
  number: text("number").notNull(),
  complement: text("complement"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip_code: text("zip_code").notNull(),
  country: text("country").notNull().default("BR"),
  is_default: boolean("is_default").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAddressSchema = createInsertSchema(addressesTable);
export const selectAddressSchema = createSelectSchema(addressesTable);
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type Address = typeof addressesTable.$inferSelect;
