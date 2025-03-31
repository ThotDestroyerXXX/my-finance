import { api } from "@/trpc/react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function handleSubmitMonthlyBudget(
  setLoading: (loading: boolean) => void,
  setOpen: (open: boolean) => void,
) {
  const utils = api.useUtils();
  const { mutate } = api.budget.createBudget.useMutation({
    onMutate: () => {
      setLoading(true);
      toast.info("Creating budget...");
    },
    onSuccess: async () => {
      await utils.budget.invalidate();
      await utils.account.invalidate();
      setOpen(false);
      setLoading(false);
      toast.success("Budget created successfully");
    },
    onError: (error) => {
      const errorMessages = error.data?.zodError?.fieldErrors
        ? Object.values(error.data.zodError.fieldErrors).flat()
        : [error.message];
      errorMessages.forEach((msg) => toast.error(msg));
      setLoading(false);
    },
  });

  const { mutate: mutateUpdate } = api.budget.updateBudget.useMutation({
    onMutate: () => {
      setLoading(true);
      toast.info("Updating budget...");
    },
    onSuccess: async () => {
      await utils.budget.invalidate();
      await utils.account.invalidate();
      setOpen(false);
      setLoading(false);
      toast.success("Budget updated successfully");
    },
    onError: (error) => {
      const errorMessages = error.data?.zodError?.fieldErrors
        ? Object.values(error.data.zodError.fieldErrors).flat()
        : [error.message];
      errorMessages.forEach((msg) => toast.error(msg));
      setLoading(false);
    },
  });

  const createBudget = (
    e: React.FormEvent<HTMLFormElement>,
    user_account_id: string,
    isUpdate?: boolean,
    budget_id?: string,
  ) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const amount_limit = form.get("amount") as string;
    const id = uuidv4();
    if (isUpdate === true && budget_id) {
      mutateUpdate({
        id: budget_id,
        user_account_id,
        amount_limit,
      });
    } else {
      mutate({
        id,
        user_account_id,
        amount_limit,
      });
    }
  };
  return { createBudget };
}

export function handleSubmitCategoryBudget(
  setLoading: (loading: boolean) => void,
  setOpen: (open: boolean) => void,
) {
  const utils = api.useUtils();
  const { mutate } = api.budget.createCategoryBudget.useMutation({
    onMutate: () => {
      setLoading(true);
      toast.info("Creating category budget...");
    },
    onSuccess: async () => {
      await utils.budget.invalidate();
      await utils.user.invalidate();
      setLoading(false);
      setOpen(false);
      toast.success("Category budget created successfully");
    },
    onError: (error) => {
      const errorMessages = error.data?.zodError?.fieldErrors
        ? Object.values(error.data.zodError.fieldErrors).flat()
        : [error.message];
      errorMessages.forEach((msg) => toast.error(msg));
      setLoading(false);
    },
  });

  const { mutate: updateMutate } = api.budget.updateCategoryBudget.useMutation({
    onMutate: () => {
      setLoading(true);
      toast.info("Updating category budget...");
    },
    onSuccess: async () => {
      await utils.budget.invalidate();
      await utils.user.invalidate();
      setLoading(false);
      setOpen(false);
      toast.success("Category budget updated successfully");
    },
    onError: (error) => {
      const errorMessages = error.data?.zodError?.fieldErrors
        ? Object.values(error.data.zodError.fieldErrors).flat()
        : [error.message];
      errorMessages.forEach((msg) => toast.error(msg));
      setLoading(false);
    },
  });

  const createCategoryBudget = (
    e: React.FormEvent<HTMLFormElement>,
    user_id: string,
    budget_id?: string,
  ) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const amount_limit = form.get("amount") as string;
    const category_id = form.get("category") as string;
    const id = uuidv4();
    if (budget_id) {
      updateMutate({
        id: budget_id,
        user_id,
        amount_limit,
        category_id,
      });
    } else {
      mutate({
        id,
        user_id,
        amount_limit,
        category_id,
      });
    }
  };
  return { createCategoryBudget };
}

export const handleDeleteCategoryBudget = (
  setLoading: (loading: boolean) => void,
) => {
  const utils = api.useUtils();
  const { mutate } = api.budget.deleteCategoryBudget.useMutation({
    onMutate: () => {
      setLoading(true);
      toast.info("Deleting category budget...");
    },
    onSuccess: async () => {
      await utils.budget.invalidate();
      await utils.user.invalidate();
      setLoading(false);
      toast.success("Category budget deleted successfully");
    },
    onError: (error) => {
      const errorMessages = error.data?.zodError?.fieldErrors
        ? Object.values(error.data.zodError.fieldErrors).flat()
        : [error.message];
      errorMessages.forEach((msg) => toast.error(msg));
      setLoading(false);
    },
  });

  const deleteCategoryBudget = (category_budget_id: string) => {
    mutate({ id: category_budget_id });
  };
  return { deleteCategoryBudget };
};

export const fetchMonthlyBudgetByAccountId = (account_id: string) => {
  const {
    data: monthlyBudget,
    isPending,
    isFetched,
  } = api.budget.getMonthlyBudget.useQuery(
    {
      user_account_id: account_id,
    },
    {
      enabled: !!account_id,
    },
  );
  return { monthlyBudget, isPending, isFetched };
};

export const fetchCategoryBudgetByUserId = (user_id: string) => {
  const {
    data: categoryBudget,
    isPending,
    isFetched,
  } = api.budget.getCategoryBudget.useQuery(
    {
      user_id,
    },
    {
      enabled: !!user_id,
    },
  );
  return { categoryBudget, isPending, isFetched };
};
