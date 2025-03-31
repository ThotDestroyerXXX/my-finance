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
} from "@/components/ui/alert-dialog";
import { handleDeleteCategory } from "@/hooks/category-hook";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export function AlertDeleteCategory({
  category_id,
  user_id,
  setLoading,
  icon,
}: Readonly<{
  category_id: string | undefined;
  user_id: string | undefined;
  setLoading: (loading: boolean) => void;
  icon?: React.ReactNode;
}>) {
  const { handleDelete } = handleDeleteCategory(setLoading);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="flex cursor-pointer flex-row items-center gap-2 rounded-sm border-none px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white"
          onSelect={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {icon}
          delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            category and transactions related to the category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              handleDelete(category_id ?? "", user_id ?? "");
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
