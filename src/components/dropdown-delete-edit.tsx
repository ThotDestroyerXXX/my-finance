import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
} from "./ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { TableCell } from "./ui/table";
import { DeleteAlert } from "./delete-alert";
import AddTransaction from "./add-transaction";
import { type transactionProps } from "@/lib/interface";

export default function DropdownDeleteEdit({
  account_id,
  transaction,
  setLoading,
  user_id,
}: Readonly<{
  account_id: string | undefined;
  transaction: transactionProps;
  setLoading: (loading: boolean) => void;
  user_id: string | undefined;
}>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TableCell>
          <EllipsisVertical className="h-4 w-4 cursor-pointer" />
        </TableCell>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <AddTransaction
            account_id={account_id}
            amount={transaction.amount}
            category_id={transaction.category_id.toString()}
            description={transaction.description ?? undefined}
            isUpdate={true}
            placeholder="Update"
            transaction_date={transaction.transaction_date}
            transaction_id={transaction.id}
            transaction_type={transaction.transaction_type}
            user_id={user_id}
            setLoading={setLoading}
          />
          <DeleteAlert
            transaction_id={transaction.id}
            account_id={account_id}
            setLoading={setLoading}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
