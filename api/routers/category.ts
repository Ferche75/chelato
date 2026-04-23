import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { categories } from "@db/schema";

export const categoryRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(categories);
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        icon: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [category] = await db.insert(categories).values(input).$returnId();
      return { id: category.id, ...input };
    }),
});
