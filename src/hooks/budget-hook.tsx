import { api } from "@/trpc/react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function handleSubmitMonthlyBudget(
  setLoading: (loading: boolean) => void,
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

  const createBudget = (
    e: React.FormEvent<HTMLFormElement>,
    user_account_id: string,
  ) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const amount_limit = form.get("amount") as string;
    const id = uuidv4();
    mutate({
      id,
      user_account_id,
      amount_limit,
    });
  };
  return { createBudget };
}
