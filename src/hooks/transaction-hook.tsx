import { api } from "@/trpc/react";

export const fetchAccountExpenseByUserId = (
  user_id: string,
  account_id: string,
) => {
  const {
    data: expenses,
    isPending,
    isFetched,
  } = api.transaction.getAccountExpenseByUserId.useQuery(
    {
      user_id: user_id,
      account_id: account_id,
    },
    {
      enabled: !!account_id && !!user_id,
    },
  );
  return { expenses, isPending, isFetched };
};

export const fetchAccountIncomeByUserId = (
  user_id: string,
  account_id: string,
) => {
  const {
    data: incomes,
    isPending,
    isFetched,
  } = api.transaction.getAccountIncomeByUserId.useQuery(
    {
      user_id: user_id,
      account_id: account_id,
    },
    {
      enabled: !!account_id && !!user_id,
    },
  );
  return { incomes, isPending, isFetched };
};

export const fetchMonthlyExpenseByAccountId = (account_id: string) => {
  const { data: monthlyExpense } = api.transaction.getMonthlyExpense.useQuery(
    {
      account_id: account_id,
    },
    {
      enabled: !!account_id,
    },
  );
  return { monthlyExpense };
};

export const fetchMonthlyIncomeByAccountId = (account_id: string) => {
  const { data: monthlyIncome } = api.transaction.getMonthlyIncome.useQuery(
    {
      account_id: account_id,
    },
    {
      enabled: !!account_id,
    },
  );
  return { monthlyIncome };
};

export const fetchOverallIncomeByAccountId = (account_id: string) => {
  const { data: overallIncome } = api.transaction.getOverallIncome.useQuery(
    {
      account_id: account_id,
    },
    {
      enabled: !!account_id,
    },
  );
  return { overallIncome };
};

export const fetchOverallExpenseByAccountId = (account_id: string) => {
  const { data: overallExpense } = api.transaction.getOverallExpense.useQuery(
    {
      account_id: account_id,
    },
    {
      enabled: !!account_id,
    },
  );
  return { overallExpense };
};

export const fetchTransactionByAccountId = ({
  user_id,
  account_id,
}: {
  user_id: string;
  account_id: string;
}) => {
  const {
    data: transactions,
    isFetched,
    isPending,
  } = api.transaction.getAllTransactionByUserId.useQuery(
    {
      user_id: user_id,
      account_id: account_id,
    },
    {
      enabled: !!account_id && !!user_id,
    },
  );
  return { transactions, isFetched, isPending };
};
