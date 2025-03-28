import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { monthly_budget } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const budgetRouter = createTRPCRouter({
  createBudget: publicProcedure
    .input(
      z.object({
        id: z.string().nonempty("id cannot be empty!"),
        user_account_id: z.string().nonempty("account not found!"),
        amount_limit: z.string().nonempty("amount cannot be empty!"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (isNaN(Number(input.amount_limit))) {
          throw new Error("Amount must be a number!");
        }
        if (
          Number(input.amount_limit) <= 0 ||
          Number(input.amount_limit) >= 1000000000000000
        ) {
          throw new Error(
            "Amount must be greater than 0 and less than 1.000.000.000.000.000",
          );
        }
        const budget = await ctx.db.insert(monthly_budget).values({
          id: input.id,
          user_account_id: input.user_account_id,
          amount_limit: input.amount_limit,
        });
        return budget;
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

  updateBudget: publicProcedure
    .input(
      z.object({
        id: z.string().nonempty("id cannot be empty!"),
        user_account_id: z.string().nonempty("account not found!"),
        amount_limit: z.string().nonempty("amount cannot be empty!"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (isNaN(Number(input.amount_limit))) {
          throw new Error("Amount must be a number!");
        }
        if (
          Number(input.amount_limit) <= 0 ||
          Number(input.amount_limit) >= 1000000000000000
        ) {
          throw new Error(
            "Amount must be greater than 0 and less than 1.000.000.000.000.000",
          );
        }
        return await ctx.db
          .update(monthly_budget)
          .set({
            amount_limit: input.amount_limit,
          })
          .where(
            and(
              eq(monthly_budget.id, input.id),
              eq(monthly_budget.user_account_id, input.user_account_id),
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

  deleteBudget: publicProcedure
    .input(
      z.object({
        id: z.string().nonempty("id not found!"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.db
          .delete(monthly_budget)
          .where(eq(monthly_budget.id, input.id));
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

  getMonthlyBudget: publicProcedure
    .input(
      z.object({
        user_account_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const budget = await ctx.db.query.monthly_budget.findFirst({
        where: (fields, operators) =>
          operators.and(eq(fields.user_account_id, input.user_account_id)),
      });
      if (!budget) {
        return null;
      }
      return budget;
    }),
});
