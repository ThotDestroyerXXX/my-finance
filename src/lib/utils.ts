import { clsx, type ClassValue } from "clsx";
import { getMonth } from "date-fns";
import { twMerge } from "tailwind-merge";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type AppRouter } from "@/server/api/root";
import { toast } from "sonner";
import { z } from "zod";
import { maxNum } from "./interface";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currency(value: number) {
  return new Intl.NumberFormat().format(value);
}

export function getTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function calculateBar(
  value: string | number | undefined,
  total: string,
) {
  return (Number(value) / Number(total)) * 100;
}

export function calculateIncome(
  income: {
    totalIncome: string | null;
    transaction_date: string;
  }[],
) {
  return income
    .filter((item) => getMonth(item.transaction_date) === getMonth(new Date()))
    .reduce((sum, item) => sum + Number(item.totalIncome ?? "0"), 0);
}
export function calculateExpense(
  expense: {
    totalExpense: string | null;
    transaction_date: string;
  }[],
) {
  return expense
    .filter((item) => getMonth(item.transaction_date) === getMonth(new Date()))
    .reduce((sum, item) => sum + Number(item.totalExpense ?? "0"), 0);
}

export function calculateRate(
  data: {
    totalTransaction: string | null;
    transaction_date: string;
  }[],
) {
  const totalThisMonth = data
    .filter((item) => getMonth(item.transaction_date) === getMonth(new Date()))
    .reduce((sum, item) => sum + Number(item.totalTransaction ?? "0"), 0);
  const totalLastMonth = data
    .filter(
      (item) => getMonth(item.transaction_date) === getMonth(new Date()) - 1,
    )
    .reduce((sum, item) => sum + Number(item.totalTransaction ?? "0"), 0);

  if (totalLastMonth === 0) {
    return 0;
  }
  return Number(
    Number(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100).toFixed(
      2,
    ),
  );
}

export function showErrorMessage(error: TRPCClientErrorLike<AppRouter>) {
  const errorMessages = error.data?.zodError?.fieldErrors
    ? Object.values(error.data.zodError.fieldErrors).flat()
    : [error.message];
  errorMessages.forEach((msg) => toast.error(msg));
}

export function updateBalance({
  inputTransactionType,
  transactionTransactionType,
  balance,
  oldAmount,
  inputAmount,
}: {
  inputTransactionType: string;
  transactionTransactionType: string;
  balance: string | number;
  oldAmount: string | number;
  inputAmount: string | number;
}) {
  if (
    inputTransactionType === "Income" &&
    transactionTransactionType === "Income"
  ) {
    return Number(balance) - Number(oldAmount) + Number(inputAmount);
  }
  if (
    inputTransactionType === "Expense" &&
    transactionTransactionType === "Expense"
  ) {
    return Number(balance) + Number(oldAmount) - Number(inputAmount);
  }
  if (
    inputTransactionType === "Income" &&
    transactionTransactionType === "Expense"
  ) {
    return Number(balance) + Number(inputAmount) + Number(oldAmount);
  }
  if (
    inputTransactionType === "Expense" &&
    transactionTransactionType === "Income"
  ) {
    return Number(balance) - Number(inputAmount) - Number(oldAmount);
  } else {
    throw new Error("Invalid transaction type");
  }
}

export function formatError(e: unknown) {
  if (e instanceof z.ZodError) {
    toast.error(e.errors?.[0]?.message);
    throw new Error(e.errors.map((issue) => issue.message).join(", "));
  }
  if (e instanceof Error) {
    throw new Error(e.message);
  }
  throw new Error("An unknown error occurred");
}

export function checkNumber({
  value,
  placeholder,
}: {
  value: string | number;
  placeholder: string;
}) {
  if (isNaN(Number(value))) {
    throw new Error(`${placeholder} must be a number`);
  }
  if (Number(value) <= 0 || Number(value) >= maxNum) {
    throw new Error(
      `${placeholder} must be greater than 0 and less than 1.000.000.000.000.000`,
    );
  }
}
