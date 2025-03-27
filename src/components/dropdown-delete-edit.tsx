import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { TableCell } from "./ui/table";
import { DeleteAlert } from "./delete-alert";

export default function DropdownDeleteEdit({
  account_id,
  transaction_id,
  setLoading,
}: Readonly<{
  account_id: string | undefined;
  transaction_id: string;
  setLoading: (loading: boolean) => void;
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
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DeleteAlert
            transaction_id={transaction_id}
            account_id={account_id}
            setLoading={setLoading}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
