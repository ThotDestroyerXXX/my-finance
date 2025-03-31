import {
  type user_account,
  type transaction,
  type category,
  type monthly_budget,
  type category_budget,
} from "@/server/db/schema";

export enum TransactionType {
  Income = "Income",
  Expense = "Expense",
}

export type accountProps = typeof user_account.$inferSelect;

export type CategoryProps = typeof category.$inferSelect;

export type transactionProps = typeof transaction.$inferSelect;

export type MonthlyBudgetProps = typeof monthly_budget.$inferSelect;

export type CategoryBudget = typeof category_budget.$inferSelect;

export const maxNum = 10000000000000;

export type MonthlyChart = {
  transactions:
    | {
        user_account: accountProps;
        category: CategoryProps;
        transaction: transactionProps;
      }[]
    | undefined
    | null;
  isFetched: boolean;
  isPending: boolean;
  transactionAmount: string | number | undefined;
  placeholder: string;
};

export type CategoryBudgetProps =
  | {
      category_budget: CategoryBudget;
      category: CategoryProps | null;
      totalExpense: string | null;
    }
  | null
  | undefined;

export type TransactionProps = {
  transactions:
    | {
        user_account: accountProps;
        category: CategoryProps;
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
