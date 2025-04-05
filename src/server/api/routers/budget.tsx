import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  category,
  category_budget,
  monthly_budget,
  transaction,
  user,
} from "@/server/db/schema";
import { and, eq, sum } from "drizzle-orm";
import { checkNumber, formatError } from "@/lib/utils";

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
        checkNumber({
          value: input.amount_limit,
          placeholder: "Amount",
        });
        const budget = await ctx.db.insert(monthly_budget).values({
          id: input.id,
          user_account_id: input.user_account_id,
          amount_limit: input.amount_limit,
        });
        return budget;
      } catch (e) {
        formatError(e);
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
        checkNumber({
          value: input.amount_limit,
          placeholder: "Amount",
        });
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
        formatError(e);
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
        formatError(e);
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
      return budget ?? null;
    }),

  createCategoryBudget: publicProcedure
    .input(
      z.object({
        id: z.string().nonempty("id cannot be empty!"),
        user_id: z.string().nonempty("user not found!"),
        category_id: z.string().nonempty("category not found!"),
        amount_limit: z.string().nonempty("amount cannot be empty!"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        checkNumber({
          value: input.amount_limit,
          placeholder: "Amount",
        });
        const existingBudget = await ctx.db.query.category_budget.findFirst({
          where: (fields, operators) =>
            operators.and(
              eq(fields.user_id, input.user_id),
              eq(fields.category_id, Number(input.category_id)),
            ),
        });
        if (existingBudget) {
          return ctx.db
            .update(category_budget)
            .set({
              amount_limit: input.amount_limit,
            })
            .where(
              and(
                eq(category_budget.id, existingBudget.id),
                eq(category_budget.user_id, input.user_id),
              ),
            );
        }
        const budget = await ctx.db.insert(category_budget).values({
          id: input.id,
          user_id: input.user_id,
          category_id: Number(input.category_id),
          amount_limit: input.amount_limit,
        });
        return budget;
      } catch (e) {
        formatError(e);
      }
    }),

  getCategoryBudget: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const budget = await ctx.db
        .select({
          category_budget: category_budget,
          category: category,
          totalExpense: sum(transaction.amount),
        })
        .from(category_budget)
        .leftJoin(category, eq(category.id, category_budget.category_id))
        .leftJoin(transaction, eq(transaction.category_id, category.id))
        .leftJoin(user, eq(user.id, category_budget.user_id))
        .groupBy(category_budget.id, category.id, user.id)
        .where(eq(user.id, input.user_id))
        .execute();
      return budget ?? null;
    }),

  updateCategoryBudget: publicProcedure
    .input(
      z.object({
        id: z.string().nonempty("id cannot be empty!"),
        user_id: z.string().nonempty("user not found!"),
        category_id: z.string().nonempty("category not found!"),
        amount_limit: z.string().nonempty("amount cannot be empty!"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        checkNumber({
          value: input.amount_limit,
          placeholder: "Amount",
        });

        const existingBudget = await ctx.db.query.category_budget.findFirst({
          where: (fields, operators) =>
            operators.and(
              eq(fields.user_id, input.user_id),
              eq(fields.category_id, Number(input.category_id)),
            ),
        });
        if (existingBudget) {
          throw new Error("Budget already exists for this category!");
        }

        const budget = await ctx.db
          .update(category_budget)
          .set({
            amount_limit: input.amount_limit,
            category_id: Number(input.category_id),
          })
          .where(
            and(
              eq(category_budget.id, input.id),
              eq(category_budget.user_id, input.user_id),
            ),
          )
          .execute();
        return budget ?? null;
      } catch (e) {
        formatError(e);
      }
    }),

  deleteCategoryBudget: publicProcedure
    .input(
      z.object({
        id: z.string().nonempty("id cannot be empty!"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.db
          .delete(category_budget)
          .where(eq(category_budget.id, input.id));
      } catch (e) {
        formatError(e);
      }
    }),
});
