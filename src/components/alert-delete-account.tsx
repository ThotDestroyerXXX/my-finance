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
import { handleDeleteAccount } from "@/hooks/account-hook";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export function AlertDeleteAccount({
  account_id,
  setLoading,
  icon,
}: Readonly<{
  account_id: string | undefined;
  setLoading: (loading: boolean) => void;
  icon?: React.ReactNode;
}>) {
  const { handleDelete } = handleDeleteAccount(setLoading);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="flex cursor-pointer flex-row items-center gap-2 rounded-sm p-1 text-red-500 hover:bg-red-500 hover:text-white"
          onSelect={(e) => {
            e.stopPropagation();
            e.stopPropagation();
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
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              handleDelete(account_id ?? "");
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
