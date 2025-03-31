import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { category, category_budget, transaction } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const categoryRouter = createTRPCRouter({
  createCategory: publicProcedure
    .input(
      z.object({
        user_id: z.string().nonempty("user id cannot be empty!"),
        category_name: z
          .string()
          .min(2, "category name must be more than 1 characters!")
          .max(30, "category name must be less than 30 characters!"),
        icon: z.string().emoji("icon must be an emoji!"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const newCategory = await ctx.db.insert(category).values({
          user_id: input.user_id,
          name: input.category_name,
          icon_image: input.icon,
        });
        return newCategory;
      } catch (e) {
        if (e instanceof z.ZodError) {
          throw new Error(e.errors.map((issue) => issue.message).join(", "));
        }
        if (e instanceof Error) {
          throw new Error(e.message);
        }
        throw new Error("An unknown error occurred");
      }
    }),

  updateCategory: publicProcedure
    .input(
      z.object({
        category_id: z.string().nonempty("category id cannot be empty!"),
        user_id: z.string().nonempty("user id cannot be empty!"),
        category_name: z
          .string()
          .min(2, "category name must be more than 1 characters!")
          .max(30, "category name must be less than 30 characters!"),
        icon: z.string().emoji("icon must be an emoji!"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedCategory = await ctx.db
          .update(category)
          .set({
            name: input.category_name,
            icon_image: input.icon,
          })
          .where(
            and(
              eq(category.id, Number(input.category_id)),
              eq(category.user_id, input.user_id),
            ),
          );
        return updatedCategory;
      } catch (e) {
        if (e instanceof z.ZodError) {
          throw new Error(e.errors.map((issue) => issue.message).join(", "));
        }
        if (e instanceof Error) {
          throw new Error(e.message);
        }
        throw new Error("An unknown error occurred");
      }
    }),

  deleteCategory: publicProcedure
    .input(
      z.object({
        category_id: z.string().nonempty("category id cannot be empty!"),
        user_id: z.string().nonempty("user id cannot be empty!"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db
          .delete(transaction)
          .where(eq(transaction.category_id, Number(input.category_id)));

        await ctx.db
          .delete(category_budget)
          .where(eq(category_budget.category_id, Number(input.category_id)));

        return await ctx.db
          .delete(category)
          .where(
            and(
              eq(category.id, Number(input.category_id)),
              eq(category.user_id, input.user_id),
            ),
          );
      } catch (e) {
        if (e instanceof z.ZodError) {
          throw new Error(e.errors.map((issue) => issue.message).join(", "));
        }
        if (e instanceof Error) {
          throw new Error(e.message);
        }
        throw new Error("An unknown error occurred");
      }
    }),
});
