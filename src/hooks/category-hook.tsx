import { showErrorMessage } from "@/lib/utils";
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
      showErrorMessage(error);
      setLoading(false);
    },
    onSuccess: async () => {
      await utils.invalidate();
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
      showErrorMessage(error);
      setLoading(false);
    },
    onSuccess: async () => {
      await utils.invalidate();
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
      showErrorMessage(error);
      setLoading(false);
    },
    onSuccess: async () => {
      await utils.invalidate();
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
