import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { monthly_budget } from "@/server/db/schema";
import { eq } from "drizzle-orm";

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
