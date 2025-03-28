import { api } from "@/trpc/react";
import { getParamByISO } from "iso-country-currency";
import { redirect } from "next/navigation";
import type React from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export const fetchAllAccountTypes = () => {
  const {
    data: accountTypes,
    isPending,
    isError,
  } = api.account.getAccountTypeList.useQuery();
  return { accountTypes, isPending, isError };
};

export const useCreateAccount = (
  setLoading: (loading: boolean) => void,
  setOpen: (open: boolean) => void,
) => {
  const utils = api.useUtils();
  const { mutate } = api.account.createAccount.useMutation({
    onError: (error) => {
      const errorMessages = error.data?.zodError?.fieldErrors
        ? Object.values(error.data.zodError.fieldErrors).flat()
        : [error.message];
      errorMessages.forEach((msg) => toast.error(msg));
      setLoading(false);
    },
    onMutate: () => {
      toast.info("Creating account...");
      setLoading(true);
    },
    onSuccess: async () => {
      await utils.account.getAccountList.invalidate();
      setOpen(false);
      setLoading(false);
      toast.success("Account created successfully");
    },
  });

  const createAccount = (
    e: React.FormEvent<HTMLFormElement>,
    user_id: string | undefined,
    selectedAccountType: string | null,
    selectedCurrencyType: string | null,
  ) => {
    e.preventDefault();
    setLoading(true);
    if (!user_id) {
      redirect("/auth/login");
    }

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const balance = form.get("balance") as string;

    if (!name || !balance || !selectedAccountType || !selectedCurrencyType) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    const symbol = getParamByISO(selectedCurrencyType ?? "", "symbol");

    const id = uuidv4();

    mutate({
      id: id,
      user_id,
      name,
      balance: balance,
      user_account_type_id: Number(selectedAccountType ?? "-1"),
      currency_type: symbol,
    });
  };

  return createAccount;
};

export const fetchAccountByUserId = (user_id: string, account_id: string) => {
  const {
    data: account,
    isPending,
    isFetched,
  } = api.account.getAccountByUserId.useQuery(
    {
      user_id: user_id ?? "",
      account_id: account_id ?? "",
    },
    {
      enabled: !!account_id && !!user_id,
    },
  );
  return { account, isPending, isFetched };
};

export const handleSubmitCreateIncome = (
  setLoading: (loading: boolean) => void,
  setOpen: (open: boolean) => void,
) => {
  const utils = api.useUtils();
  const { mutate } = api.transaction.createIncome.useMutation({
    onMutate: () => {
      toast.info("Creating income...");
      setLoading(true);
    },
    onError: (error) => {
      const errorMessages = error.data?.zodError?.fieldErrors
        ? Object.values(error.data.zodError.fieldErrors).flat()
        : [error.message];
      errorMessages.forEach((msg) => toast.error(msg));
      setLoading(false);
    },
    onSuccess: async () => {
      await utils.transaction.invalidate();
      await utils.account.invalidate();
      await utils.budget.invalidate();
      setOpen(false);
      setLoading(false);
      toast.success("Income created successfully");
    },
  });

  const { mutate: mutateUpdate } =
    api.transaction.updateTransaction.useMutation({
      onMutate: () => {
        toast.info("Updating income...");
        setLoading(true);
      },
      onError: (error) => {
        const errorMessages = error.data?.zodError?.fieldErrors
          ? Object.values(error.data.zodError.fieldErrors).flat()
          : [error.message];
        errorMessages.forEach((msg) => toast.error(msg));
        setLoading(false);
      },
      onSuccess: async () => {
        await utils.transaction.invalidate();
        await utils.account.invalidate();
        await utils.budget.invalidate();
        setOpen(false);
        setLoading(false);
        toast.success("Income updated successfully");
      },
    });

  const createIncome = (
    e: React.FormEvent<HTMLFormElement>,
    selectedDate: Date | null,
    accountId: string,
    userId?: string,
    isUpdate?: boolean,
    transaction_id?: string,
  ) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const amount = form.get("amount") as string;
    const description = form.get("description") as string;
    const category_id = form.get("category") as string;
    const date = selectedDate ?? new Date();
    const transactionType = form.get("transaction_type") as string;
    const id = uuidv4();

    if (isUpdate && transaction_id) {
      mutateUpdate({
        transaction_id: transaction_id,
        amount: amount,
        description,
        account_id: accountId,
        category_id: category_id,
        transaction_type: transactionType,
        transaction_date: date,
      });
    } else if (userId) {
      mutate({
        id,
        amount: amount,
        description,
        account_id: accountId,
        category_id: category_id,
        date: date,
        transaction_type: transactionType,
        user_id: userId,
      });
    }
  };
  return { createIncome };
};

export const deleteTransaction = (setLoading: (loading: boolean) => void) => {
  const utils = api.useUtils();
  const { mutate } = api.transaction.deleteTransaction.useMutation({
    onMutate: () => {
      setLoading(true);
      toast.info("Deleting transaction...");
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message);
    },
    onSuccess: async () => {
      await utils.transaction.invalidate();
      await utils.account.invalidate();
      await utils.budget.invalidate();
      toast.success("Transaction deleted successfully");
      setLoading(false);
    },
  });

  const { mutate: mutateDelete } = api.budget.deleteBudget.useMutation({
    onMutate: () => {
      setLoading(true);
      toast.info("Deleting budget...");
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message);
    },
    onSuccess: async () => {
      await utils.transaction.invalidate();
      await utils.account.invalidate();
      await utils.budget.invalidate();
      toast.success("Budget deleted successfully");
      setLoading(false);
    },
  });

  const handleDelete = ({
    transaction_id,
    account_id,
    monthly_budget_id,
  }: {
    transaction_id?: string;
    account_id: string;
    monthly_budget_id?: string;
  }) => {
    if (transaction_id) {
      mutate({ transaction_id, account_id });
    } else if (monthly_budget_id) {
      mutateDelete({ id: monthly_budget_id });
    }
  };

  return { handleDelete };
};
