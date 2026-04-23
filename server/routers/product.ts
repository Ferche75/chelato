import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { products } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        categoryId: z.number().optional(),
        branchId: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input?.categoryId) {
        conditions.push(eq(products.categoryId, input.categoryId));
      }
      if (conditions.length > 0) {
        return db.select().from(products).where(and(...conditions));
      }
      return db.select().from(products);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [product] = await db.select().from(products).where(eq(products.id, input.id));
      return product ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        categoryId: z.number(),
        image: z.string().optional(),
        basePrice: z.string(),
        priceHalfKg: z.string().optional(),
        priceOneKg: z.string().optional(),
        priceCone: z.string().optional(),
        priceCup: z.string().optional(),
        isPopsicle: z.boolean().default(false),
        maxFlavors: z.number().default(1),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [product] = await db.insert(products).values(input).$returnId();
      return { id: product.id, ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        categoryId: z.number().optional(),
        image: z.string().optional(),
        basePrice: z.string().optional(),
        priceHalfKg: z.string().optional(),
        priceOneKg: z.string().optional(),
        priceCone: z.string().optional(),
        priceCup: z.string().optional(),
        isPopsicle: z.boolean().optional(),
        maxFlavors: z.number().optional(),
        tags: z.array(z.string()).optional(),
        isAvailable: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(products).set(data).where(eq(products.id, id));
      const [product] = await db.select().from(products).where(eq(products.id, id));
      return product;
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),

  toggleAvailable: adminQuery
    .input(z.object({ id: z.number(), isAvailable: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(products)
        .set({ isAvailable: input.isAvailable })
        .where(eq(products.id, input.id));
      return { success: true };
    }),
});
