import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  category,
  transaction,
  user_account,
  user_account_type,
} from "@/server/db/schema";
import { desc, eq, sum } from "drizzle-orm";
import { toast } from "sonner";

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
        .orderBy(desc(transaction.transaction_date))
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

  createIncome: publicProcedure
    .input(
      z.object({
        id: z.string().nonempty("id not found"),
        amount: z.string().nonempty("amount not found"),
        description: z
          .string()
          .max(500, "description must be less than 500 characters"),
        account_id: z.string(),
        category_id: z.string().nonempty("category not found"),
        date: z.date().max(new Date(), "date must be today or before"),
        transaction_type: z.string().nonempty("transaction type not found"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (
          input.transaction_type !== "Income" &&
          input.transaction_type !== "Expense"
        ) {
          throw new Error("Transaction type must be either Income or Expense");
        }
        if (isNaN(parseInt(input.amount))) {
          throw new Error("Amount must be a number");
        }
        if (parseInt(input.amount) <= 0) {
          throw new Error("Amount must be greater than 0");
        }
        if (isNaN(parseInt(input.category_id))) {
          throw new Error("Category not found");
        }

        return await ctx.db
          .insert(transaction)
          .values({
            id: input.id,
            amount: input.amount,
            description: input.description,
            transaction_date: input.date.toLocaleDateString(),
            transaction_type: input.transaction_type,
            category_id: parseInt(input.category_id),
            user_account_id: input.account_id,
          })
          .execute();
      } catch (e) {
        if (e instanceof z.ZodError) {
          toast.error(e.errors?.[0]?.message);
          throw new Error(e.errors.map((issue) => issue.message).join(", "));
        }
        if (e instanceof Error) {
          throw new Error(e.message);
        }
        throw new Error("An unknown error occurred");
      }
    }),
});
