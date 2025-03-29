import {
  type user_account,
  type transaction,
  type category,
  type monthly_budget,
} from "@/server/db/schema";

export enum TransactionType {
  Income = "Income",
  Expense = "Expense",
}

export type accountProps = typeof user_account.$inferSelect;

export type categoryProps = typeof category.$inferSelect;

export type transactionProps = typeof transaction.$inferSelect;

export type MonthlyBudgetProps = typeof monthly_budget.$inferSelect;

export type MonthlyChart = {
  transactions:
    | {
        user_account: accountProps;
        category: categoryProps;
        transaction: transactionProps;
      }[]
    | undefined
    | null;
  isFetched: boolean;
  isPending: boolean;
  transactionAmount: string | 0 | undefined;
  placeholder: string;
};

export type TransactionProps = {
  transactions:
    | {
        user_account: accountProps;
        category: categoryProps;
        transaction: transactionProps;
      }[]
    | undefined
    | null;
  isFetched: boolean;
  isPending: boolean;
  user_id: string | undefined;
  account_id: string | undefined;
  setLoading: (loading: boolean) => void;
};

export interface ComboboxProps {
  values: string[] | undefined;
  label?: string[];
  onSelect: (value: string) => void;
  defaultValue?: string;
}
