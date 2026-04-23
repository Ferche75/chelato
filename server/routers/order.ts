import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { orders, orderItems } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

const orderStatusEnum = z.enum(["pending", "preparing", "ready", "delivered", "cancelled"]);

export const orderRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        branchId: z.number(),
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            size: z.string(),
            quantity: z.number(),
            unitPrice: z.string(),
            flavors: z.array(z.string()).optional(),
            subtotal: z.string(),
          })
        ),
        customerName: z.string(),
        customerPhone: z.string(),
        deliveryAddress: z.string(),
        deliveryNotes: z.string().optional(),
        paymentMethod: z.enum(["cash", "card", "mercadopago"]),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const total = input.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
      const [order] = await db
        .insert(orders)
        .values({
          userId: input.userId || null,
          branchId: input.branchId,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          deliveryAddress: input.deliveryAddress,
          deliveryNotes: input.deliveryNotes,
          paymentMethod: input.paymentMethod,
          subtotal: total.toString(),
          deliveryFee: "50",
          total: (total + 50).toString(),
        })
        .$returnId();

      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          flavors: item.flavors || [],
          subtotal: item.subtotal,
        });
      }

      return { orderId: order.id, total: total + 50 };
    }),

  listAdmin: adminQuery
    .input(
      z.object({
        status: orderStatusEnum.optional(),
        branchId: z.number().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input?.status) conditions.push(eq(orders.status, input.status));
      if (input?.branchId) conditions.push(eq(orders.branchId, input.branchId));

      if (conditions.length > 0) {
        return db
          .select()
          .from(orders)
          .where(and(...conditions))
          .orderBy(desc(orders.createdAt))
          .limit(input?.limit || 50)
          .offset(input?.offset || 0);
      }
      return db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);
    }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [order] = await db.select().from(orders).where(eq(orders.id, input.id));
      if (!order) return null;
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, input.id));
      return { ...order, items };
    }),

  updateStatus: adminQuery
    .input(z.object({ id: z.number(), status: orderStatusEnum }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orders).set({ status: input.status }).where(eq(orders.id, input.id));
      const [order] = await db.select().from(orders).where(eq(orders.id, input.id));
      return order;
    }),

  myOrders: authedQuery
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      return db
        .select()
        .from(orders)
        .where(eq(orders.userId, ctx.user.id))
        .orderBy(desc(orders.createdAt))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);
    }),

  repeat: authedQuery
    .input(z.object({ orderId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, input.orderId));
      return items;
    }),
});
