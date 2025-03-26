import { api } from "@/trpc/react";

export const fetchCategoryTypeByUserId = (user_id: string) => {
  const {
    data: categoryTypes,
    isPending,
    isFetched,
    isError,
  } = api.user.getCategoryType.useQuery(
    { user_id: user_id },
    { enabled: !!user_id },
  );

  return { categoryTypes, isPending, isFetched, isError };
};
