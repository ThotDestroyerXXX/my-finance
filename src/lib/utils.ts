import { clsx, type ClassValue } from "clsx";
import { getMonth } from "date-fns";
import { twMerge } from "tailwind-merge";

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
