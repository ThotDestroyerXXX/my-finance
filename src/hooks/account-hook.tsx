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
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void,
  setOpen: (open: boolean) => void,
) => {
  const utils = api.useUtils();
  const { mutate } = api.account.createAccount.useMutation({
    onError: (error) => {
      const fieldErrors = error.data?.zodError?.fieldErrors;
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        const firstKey = Object.keys(fieldErrors)[0]!;
        setError(fieldErrors[firstKey]?.[0] ?? null);
      }
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      await utils.account.getAccountList.invalidate();
      setOpen(false);
      setLoading(false);
    },
  });

  const createAccount = (
    e: React.FormEvent<HTMLFormElement>,
    user_id: string | undefined,
    selectedAccountType: string | null,
    selectedCurrencyType: string | null,
  ) => {
    e.preventDefault();

    if (!user_id) {
      redirect("/auth/login");
    }

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const balance = form.get("balance") as string;

    if (!name || !balance || !selectedAccountType || !selectedCurrencyType) {
      setError("All fields are required");
      return;
    }

    const symbol = getParamByISO(selectedCurrencyType ?? "", "symbol");

    const id = uuidv4();

    mutate({
      id: id,
      user_id,
      name,
      balance: balance,
      user_account_type_id: parseInt(selectedAccountType ?? "-1"),
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
  setIsLoading: (loading: boolean) => void,
  setOpen: (open: boolean) => void,
) => {
  const utils = api.useUtils();
  const { mutate } = api.account.createIncome.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onError: (error) => {
      const errorMessages = error.data?.zodError?.fieldErrors
        ? Object.values(error.data.zodError.fieldErrors).flat()
        : [error.message];
      errorMessages.forEach((msg) => toast.error(msg));
      setIsLoading(false);
    },
    onSuccess: async () => {
      await utils.account.getAccountIncomeByUserId.invalidate();
      setOpen(false);
      setIsLoading(false);
    },
  });
  const createIncome = (
    e: React.FormEvent<HTMLFormElement>,
    selectedDate: Date | null,
    accountId: string,
  ) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const amount = form.get("amount") as string;
    const description = form.get("description") as string;
    const category_id = form.get("category") as string;
    const date = selectedDate ?? new Date();
    const transactionType = form.get("transaction_type") as string;
    const id = uuidv4();

    mutate({
      id,
      amount: amount,
      description,
      account_id: accountId,
      category_id: category_id,
      date: date,
      transaction_type: transactionType,
    });
  };
  return { createIncome };
};
