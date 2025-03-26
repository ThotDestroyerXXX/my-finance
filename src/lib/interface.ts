import { type user_account, type transaction } from "@/server/db/schema";

export enum TransactionType {
  Income = "Income",
  Expense = "Expense",
}

export type accountProps = typeof user_account.$inferSelect;

export type incomeProps = typeof transaction.$inferSelect;

export interface ComboboxProps {
  values: string[] | undefined;
  label?: string[];
  onSelect: (value: string) => void;
}
