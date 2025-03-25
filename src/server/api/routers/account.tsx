import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  category,
  transaction,
  user_account,
  user_account_type,
} from "@/server/db/schema";
import { eq, sum } from "drizzle-orm";

export const accountRouter = createTRPCRouter({
  getAccountList: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.db
          .select()
          .from(user_account)
          .where(eq(user_account.user_id, input.user_id))
          .execute();
      } catch {
        throw new Error("Failed to fetch account list");
      }
    }),
  getAccountTypeList: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(user_account_type).execute();
  }),
  getAccountByUserId: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        account_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const account = await ctx.db.query.user_account
        .findFirst({
          where: (fields, operators) =>
            operators.and(
              eq(fields.user_id, input.user_id),
              eq(fields.id, input.account_id),
            ),
        })
        .execute();
      if (!account) {
        return null;
      }
      return account;
    }),
  createAccount: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z
          .string()
          .nonempty("name cannot be empty!")
          .min(3, "name must be more than 3 characters!")
          .max(50, "name must be less than 50 characters!"),
        balance: z.string().nonempty("balance cannot be empty!"),
        currency_type: z.string().nonempty("currency_type cannot be empty!"),
        user_account_type_id: z
          .number()
          .nonnegative("user_account_type_id cannot be empty!"),
        user_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db
        .insert(user_account)
        .values({
          id: input.id,
          name: input.name,
          balance: input.balance,
          currency_type: input.currency_type,
          user_account_type_id: input.user_account_type_id,
          user_id: input.user_id,
        })
        .execute();
    }),
  getAccountIncomeByUserId: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        account_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const account = await ctx.db
        .select()
        .from(transaction)
        .innerJoin(
          user_account,
          eq(transaction.user_account_id, user_account.id),
        )
        .innerJoin(category, eq(category.id, transaction.category_id))
        .where(
          eq(user_account.user_id, input.user_id) &&
            eq(user_account.id, input.account_id) &&
            eq(transaction.transaction_type, "Income"),
        )
        .execute();
      if (!account) {
        return null;
      }
      return account;
    }),

  getTotalIncome: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        account_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const totalIncome = await ctx.db
        .select({ totalIncome: sum(transaction.amount) })
        .from(transaction)
        .innerJoin(
          user_account,
          eq(transaction.user_account_id, user_account.id),
        )
        .groupBy(
          transaction.user_account_id &&
            transaction.transaction_type &&
            user_account.user_id,
        )
        .where(
          eq(user_account.user_id, input.user_id) &&
            eq(user_account.id, input.account_id) &&
            eq(transaction.transaction_type, "Income"),
        )
        .execute();
      if (!totalIncome) {
        return null;
      }
      return totalIncome;
    }),
});
