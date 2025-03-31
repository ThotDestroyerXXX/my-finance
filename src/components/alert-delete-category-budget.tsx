import { handleDeleteCategoryBudget } from "@/hooks/budget-hook";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export default function AlertDeleteCategoryBudget({
  setLoading,
  category_budget_id,
}: Readonly<{
  setLoading: (loading: boolean) => void;
  category_budget_id: string | undefined;
}>) {
  const { deleteCategoryBudget } = handleDeleteCategoryBudget(setLoading);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="flex cursor-pointer flex-row items-center gap-2 rounded-sm p-1 text-red-500 hover:bg-red-500 hover:text-white"
          onSelect={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              deleteCategoryBudget(category_budget_id ?? "");
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
