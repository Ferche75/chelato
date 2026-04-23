import { createRouter, publicQuery } from "./middleware";

export const authRouter = createRouter({
  me: publicQuery.query(() => ({
    id: 1,
    name: "Admin Local",
    email: "admin@chelato.com.uy",
    avatar: null,
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignInAt: new Date(),
  })),
  logout: publicQuery.mutation(() => ({ success: true })),
});