import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { branches, products, branchProducts } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const branchRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(branches).where(eq(branches.isActive, true));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [branch] = await db.select().from(branches).where(eq(branches.id, input.id));
      return branch ?? null;
    }),

  getProducts: publicQuery
    .input(z.object({ branchId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          categoryId: products.categoryId,
          image: products.image,
          basePrice: products.basePrice,
          priceHalfKg: products.priceHalfKg,
          priceOneKg: products.priceOneKg,
          priceCone: products.priceCone,
          priceCup: products.priceCup,
          isPopsicle: products.isPopsicle,
          maxFlavors: products.maxFlavors,
          tags: products.tags,
          isAvailable: products.isAvailable,
          branchAvailable: branchProducts.isAvailable,
        })
        .from(products)
        .innerJoin(branchProducts, eq(products.id, branchProducts.productId))
        .where(
          and(
            eq(branchProducts.branchId, input.branchId),
            eq(products.isAvailable, true)
          )
        );
      return result;
    }),

  toggleProduct: adminQuery
    .input(
      z.object({
        branchId: z.number(),
        productId: z.number(),
        isAvailable: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(branchProducts)
        .set({ isAvailable: input.isAvailable })
        .where(
          and(
            eq(branchProducts.branchId, input.branchId),
            eq(branchProducts.productId, input.productId)
          )
        );
      return { success: true };
    }),
});
