import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  json,
  boolean,
  bigint,
  int,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  password: varchar("password", { length: 255 }),
  phone: varchar("phone", { length: 32 }),
  addresses: json("addresses"),
  defaultBranchId: bigint("defaultBranchId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const branches = mysqlTable("branches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  openingHours: json("openingHours").notNull(),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  slug: varchar("slug", { length: 64 }).notNull(),
  icon: varchar("icon", { length: 32 }),
});

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  categoryId: bigint("categoryId", { mode: "number", unsigned: true }).notNull(),
  image: varchar("image", { length: 255 }),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).notNull(),
  priceHalfKg: decimal("priceHalfKg", { precision: 10, scale: 2 }),
  priceOneKg: decimal("priceOneKg", { precision: 10, scale: 2 }),
  priceCone: decimal("priceCone", { precision: 10, scale: 2 }),
  priceCup: decimal("priceCup", { precision: 10, scale: 2 }),
  isPopsicle: boolean("isPopsicle").notNull().default(false),
  maxFlavors: int("maxFlavors").notNull().default(1),
  tags: json("tags"),
  isAvailable: boolean("isAvailable").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const branchProducts = mysqlTable("branch_products", {
  id: serial("id").primaryKey(),
  branchId: bigint("branchId", { mode: "number", unsigned: true }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  isAvailable: boolean("isAvailable").notNull().default(true),
  customPrice: decimal("customPrice", { precision: 10, scale: 2 }),
});

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  branchId: bigint("branchId", { mode: "number", unsigned: true }).notNull(),
  customerName: varchar("customerName", { length: 100 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 32 }).notNull(),
  deliveryAddress: varchar("deliveryAddress", { length: 255 }).notNull(),
  deliveryNotes: text("deliveryNotes"),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "card", "mercadopago"]).notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed"]).notNull().default("pending"),
  status: mysqlEnum("status", ["pending", "preparing", "ready", "delivered", "cancelled"]).notNull().default("pending"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("deliveryFee", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  productName: varchar("productName", { length: 100 }).notNull(),
  size: varchar("size", { length: 32 }).notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  flavors: json("flavors"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Branch = typeof branches.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type BranchProduct = typeof branchProducts.$inferSelect;
