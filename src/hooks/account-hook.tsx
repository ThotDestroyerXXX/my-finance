import { api } from "@/trpc/react";
import { getParamByISO } from "iso-country-currency";
import { redirect } from "next/navigation";
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
