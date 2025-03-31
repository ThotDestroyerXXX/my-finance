import { api } from "@/trpc/react";
import { toast } from "sonner";

export const createCategory = (
  setLoading: (loading: boolean) => void,
  setDialogOpen: (open: boolean) => void,
) => {
  const utils = api.useUtils();
  const { mutate } = api.category.createCategory.useMutation({
    onMutate: () => {
      setLoading(true);
      toast.info("Creating category...");
    },
    onError: (error) => {
      const errorMessages = error.data?.zodError?.fieldErrors
        ? Object.values(error.data.zodError.fieldErrors).flat()
        : [error.message];
      errorMessages.forEach((msg) => toast.error(msg));
      setLoading(false);
    },
    onSuccess: async () => {
      await utils.user.invalidate();
      await utils.category.invalidate();
      await utils.transaction.invalidate();
      await utils.account.invalidate();
      toast.success("Category created successfully");
      setLoading(false);
      setDialogOpen(false);
    },
  });

  const { mutate: mutateUpdate } = api.category.updateCategory.useMutation({
    onMutate: () => {
      setLoading(true);
      toast.info("Updating category...");
    },
    onError: (error) => {
      const errorMessages = error.data?.zodError?.fieldErrors
        ? Object.values(error.data.zodError.fieldErrors).flat()
        : [error.message];
      errorMessages.forEach((msg) => toast.error(msg));
      setLoading(false);
    },
    onSuccess: async () => {
      await utils.user.invalidate();
      await utils.category.invalidate();
      await utils.transaction.invalidate();
      await utils.account.invalidate();
      toast.success("Category updated successfully");
      setLoading(false);
      setDialogOpen(false);
    },
  });

  const handleCreate = (
    categoryName: string,
    emoji: string,
    user_id: string | undefined,
    isUpdate?: boolean,
    category_id?: string,
  ) => {
    if (isUpdate && category_id) {
      mutateUpdate({
        category_id,
        user_id: user_id ?? "",
        category_name: categoryName,
        icon: emoji,
      });
    } else {
      mutate({
        user_id: user_id ?? "",
        category_name: categoryName,
        icon: emoji,
      });
    }
  };

  return { handleCreate };
};

export const handleDeleteCategory = (
  setLoading: (loading: boolean) => void,
) => {
  const utils = api.useUtils();
  const { mutate } = api.category.deleteCategory.useMutation({
    onMutate: () => {
      setLoading(true);
      toast.info("Deleting category...");
    },
    onError: (error) => {
      const errorMessages = error.data?.zodError?.fieldErrors
        ? Object.values(error.data.zodError.fieldErrors).flat()
        : [error.message];
      errorMessages.forEach((msg) => toast.error(msg));
      setLoading(false);
    },
    onSuccess: async () => {
      await utils.user.invalidate();
      await utils.category.invalidate();
      await utils.transaction.invalidate();
      await utils.account.invalidate();
      await utils.budget.invalidate();
      toast.success("Category deleted successfully");
      setLoading(false);
    },
  });

  const handleDelete = (category_id: string, user_id: string) => {
    mutate({
      category_id,
      user_id,
    });
  };
  return { handleDelete };
};
