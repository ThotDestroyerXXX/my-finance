import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { transaction, user_account, category } from "@/server/db/schema";
import { eq, desc, sum, and, sql } from "drizzle-orm";
import { maxNum } from "@/lib/interface";
import { formatInTimeZone } from "date-fns-tz";
import { checkNumber, formatError, updateBalance } from "@/lib/utils";

export const transactionRouter = createTRPCRouter({
  getAllTransactionByUserId: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        account_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const transactionData = await ctx.db
        .select()
        .from(transaction)
        .innerJoin(
          user_account,
          eq(transaction.user_account_id, user_account.id),
        )
        .innerJoin(category, eq(category.id, transaction.category_id))
        .where(
          and(
            eq(user_account.user_id, input.user_id),
            eq(user_account.id, input.account_id),
          ),
        )
        .orderBy(desc(transaction.transaction_date))
        .limit(10)
        .execute();
      return transactionData ?? null;
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
          and(
            eq(user_account.user_id, input.user_id),
            eq(user_account.id, input.account_id),
            eq(transaction.transaction_type, "Income"),
          ),
        )
        .orderBy(desc(transaction.transaction_date))
        .execute();
      return account ?? null;
    }),

  getAccountExpenseByUserId: publicProcedure
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
          and(
            eq(user_account.user_id, input.user_id),
            eq(user_account.id, input.account_id),
            eq(transaction.transaction_type, "Expense"),
          ),
        )
        .orderBy(desc(transaction.transaction_date))
        .execute();
      return account ?? null;
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
          and(
            eq(user_account.user_id, input.user_id),
            eq(user_account.id, input.account_id),
            eq(transaction.transaction_type, "Income"),
          ),
        )
        .execute();
      return totalIncome ?? null;
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
        user_id: z.string().nonempty("user not found"),
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
        checkNumber({
          value: input.amount,
          placeholder: "Amount",
        });
        if (isNaN(Number(input.category_id))) {
          throw new Error("Category not found");
        }
        const acc = await ctx.db.query.user_account.findFirst({
          where: (fields, operators) =>
            operators.and(
              eq(fields.id, input.account_id),
              eq(fields.user_id, input.user_id),
            ),
        });
        if (!acc) {
          throw new Error("Account not found");
        }
        let newBalance = Number(0);
        if (input.transaction_type === "Income") {
          newBalance = Number(acc.balance) + Number(input.amount); // Keep as a string
        } else if (input.transaction_type === "Expense") {
          newBalance = Number(acc.balance) - Number(input.amount); // Keep as a string
        }
        if (newBalance < 0) {
          throw new Error("Insufficient balance");
        }
        if (Number(newBalance) >= maxNum) {
          throw new Error("Balance limit exceeded");
        }

        await ctx.db
          .update(user_account)
          .set({
            balance: newBalance.toString(),
          })
          .where(eq(user_account.id, input.account_id))
          .execute();

        const newDate = formatInTimeZone(
          input.date,
          "Asia/Bangkok",
          "yyyy-MM-dd",
        );

        return await ctx.db
          .insert(transaction)
          .values({
            id: input.id,
            amount: input.amount,
            description: input.description,
            transaction_date: newDate,
            transaction_type: input.transaction_type,
            category_id: Number(input.category_id),
            user_account_id: input.account_id,
          })
          .execute();
      } catch (e) {
        formatError(e);
      }
    }),

  updateTransaction: publicProcedure
    .input(
      z.object({
        amount: z.string().nonempty("amount not found"),
        description: z
          .string()
          .max(500, "description must be less than 500 characters"),
        account_id: z.string(),
        category_id: z.string().nonempty("category not found"),
        transaction_type: z.string().nonempty("transaction type not found"),
        transaction_id: z.string().nonempty("transaction not found"),
        transaction_date: z
          .date()
          .max(new Date(), "date must be today or before"),
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
        checkNumber({
          value: input.amount,
          placeholder: "Amount",
        });
        if (isNaN(Number(input.category_id))) {
          throw new Error("Category not found");
        }
        const acc = await ctx.db.query.user_account.findFirst({
          where: (fields, operators) =>
            operators.and(eq(fields.id, input.account_id)),
        });

        const transactionFind = await ctx.db.query.transaction.findFirst({
          where: (fields, operators) =>
            operators.and(
              eq(fields.id, input.transaction_id),
              eq(fields.user_account_id, input.account_id),
            ),
        });
        if (!acc || !transactionFind) {
          throw new Error("Account or Transaction not found");
        }
        const oldAmount = Number(transactionFind.amount);
        let newBalance = 0;
        newBalance = updateBalance({
          inputTransactionType: input.transaction_type,
          transactionTransactionType: transactionFind.transaction_type,
          balance: acc.balance,
          oldAmount: oldAmount,
          inputAmount: input.amount,
        });
        if (Number(newBalance) >= maxNum) {
          throw new Error("Balance limit exceeded");
        }
        if (newBalance < 0) {
          throw new Error("Insufficient balance");
        }
        await ctx.db
          .update(user_account)
          .set({
            balance: newBalance.toString(),
          })
          .where(eq(user_account.id, input.account_id))
          .execute();

        const newDate = formatInTimeZone(
          input.transaction_date,
          "Asia/Bangkok",
          "yyyy-MM-dd",
        );

        return await ctx.db
          .update(transaction)
          .set({
            amount: input.amount,
            description: input.description,
            transaction_date: newDate,
            transaction_type: input.transaction_type,
            category_id: Number(input.category_id),
          })
          .where(eq(transaction.id, input.transaction_id))
          .execute();
      } catch (e) {
        formatError(e);
      }
    }),

  deleteTransaction: publicProcedure
    .input(
      z.object({
        transaction_id: z.string(),
        account_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const transactionFind = await ctx.db.query.transaction.findFirst({
          where: (fields, operators) =>
            operators.and(
              eq(fields.id, input.transaction_id),
              eq(fields.user_account_id, input.account_id),
            ),
        });
        if (!transactionFind) {
          throw new Error("Transaction not found");
        }
        const acc = await ctx.db.query.user_account.findFirst({
          where: (fields, operators) =>
            operators.and(eq(fields.id, input.account_id)),
        });
        if (!acc) {
          throw new Error("Account not found");
        }
        let newBalance = 0;
        if (transactionFind.transaction_type === "Income") {
          newBalance = Number(acc.balance) - Number(transactionFind.amount);
        } else if (transactionFind.transaction_type === "Expense") {
          newBalance = Number(acc.balance) + Number(transactionFind.amount);
        }
        await ctx.db
          .update(user_account)
          .set({
            balance: newBalance.toString(),
          })
          .where(eq(user_account.id, input.account_id))
          .execute();
        return await ctx.db
          .delete(transaction)
          .where(
            and(
              eq(transaction.id, input.transaction_id),
              eq(transaction.user_account_id, input.account_id),
            ),
          )
          .execute();
      } catch (e) {
        formatError(e);
      }
    }),
  getMonthlyExpense: publicProcedure
    .input(
      z.object({
        account_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const expense = await ctx.db
        .select({ totalExpense: sum(transaction.amount) })
        .from(transaction)
        .where(
          and(
            eq(transaction.transaction_type, "Expense"),
            eq(transaction.user_account_id, input.account_id),
            eq(
              sql<number>`EXTRACT(MONTH FROM ${transaction.transaction_date})`,
              new Date().getMonth() + 1,
            ),
            eq(
              sql<number>`EXTRACT(YEAR FROM ${transaction.transaction_date})`,
              new Date().getFullYear(),
            ),
          ),
        )
        .execute();
      return expense[0]?.totalExpense ?? 0;
    }),

  getMonthlyIncome: publicProcedure
    .input(
      z.object({
        account_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const income = await ctx.db
        .select({ totalIncome: sum(transaction.amount) })
        .from(transaction)
        .where(
          and(
            eq(transaction.transaction_type, "Income"),
            eq(transaction.user_account_id, input.account_id),
            eq(
              sql<number>`EXTRACT(MONTH FROM ${transaction.transaction_date})`,
              new Date().getMonth() + 1,
            ),
            eq(
              sql<number>`EXTRACT(YEAR FROM ${transaction.transaction_date})`,
              new Date().getFullYear(),
            ),
          ),
        )
        .execute();
      return income[0]?.totalIncome ?? 0;
    }),

  getOverallIncome: publicProcedure
    .input(
      z.object({
        account_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const income = await ctx.db
        .select({
          totalIncome: sum(transaction.amount),
          transaction_date: transaction.transaction_date,
        })
        .from(transaction)
        .groupBy(
          transaction.transaction_date,
          transaction.transaction_type,
          transaction.user_account_id,
        )

        .where(
          and(
            eq(transaction.transaction_type, "Income"),
            eq(transaction.user_account_id, input.account_id),
          ),
        )

        .execute();
      return income ?? null;
    }),

  getOverallExpense: publicProcedure
    .input(z.object({ account_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const expense = await ctx.db
        .select({
          totalExpense: sum(transaction.amount),
          transaction_date: transaction.transaction_date,
        })
        .from(transaction)
        .groupBy(
          transaction.transaction_date,
          transaction.transaction_type,
          transaction.user_account_id,
        )
        .where(
          and(
            eq(transaction.transaction_type, "Expense"),
            eq(transaction.user_account_id, input.account_id),
          ),
        )
        .execute();
      return expense ?? null;
    }),
});
