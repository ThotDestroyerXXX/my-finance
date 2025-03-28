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
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { deleteTransaction } from "@/hooks/account-hook";

export function DeleteAlert({
  transaction_id,
  account_id,
  setLoading,
  monthly_budget_id,
}: Readonly<{
  transaction_id?: string;
  account_id: string | undefined;
  setLoading: (loading: boolean) => void;
  monthly_budget_id?: string;
}>) {
  const { handleDelete } = deleteTransaction(setLoading);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="text-red-500"
          onSelect={(e) => e.preventDefault()}
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
              setLoading(true);
              if (monthly_budget_id) {
                handleDelete({
                  monthly_budget_id: monthly_budget_id,
                  account_id: account_id ?? "",
                });
              } else {
                handleDelete({
                  transaction_id: transaction_id,
                  account_id: account_id ?? "",
                });
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
