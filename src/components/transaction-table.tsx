import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import AddTransaction from "./add-transaction";
import { type TransactionProps } from "@/lib/interface";
import { currency } from "@/lib/utils";
import { useState } from "react";
import { differenceInDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import DropdownDeleteEdit from "./dropdown-delete-edit";

export default function TransactionTable({
  transactions,
  isPending,
  isFetched,
  user_id,
  account_id,
  setLoading,
}: Readonly<TransactionProps>) {
  const [filterDate, setFilterDate] = useState<number | null>(30);
  return (
    <>
      {isPending || !isFetched ? (
        <Skeleton className="h-[20rem] w-full" />
      ) : (
        <>
          <div className="flex justify-between gap-4 max-[25rem]:flex-col">
            <AddTransaction
              user_id={user_id}
              account_id={account_id}
              setLoading={setLoading}
            />
            <Select
              name="filter_date"
              defaultValue="30"
              onValueChange={(value) => setFilterDate(Number(value))}
            >
              <SelectTrigger className="min-w-40 max-[25rem]:w-full">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="14">Last 14 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="60">Last 60 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="180">Last 180 Days</SelectItem>
                <SelectItem value="365">Last 365 Days</SelectItem>
                <SelectItem value="-1">Overall</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-hidden rounded-md">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Transaction Type</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions
                  ?.filter((date) => {
                    if (filterDate === -1) {
                      return (
                        differenceInDays(
                          new Date(),
                          date.transaction.transaction_date,
                        ) >= 0
                      );
                    } else {
                      return (
                        differenceInDays(
                          new Date(),
                          date.transaction.transaction_date,
                        ) <= (filterDate ?? 30)
                      );
                    }
                  })
                  .map((transaction) => (
                    <TableRow key={transaction.transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.user_account.name}
                      </TableCell>
                      <TableCell>
                        {transaction.category.icon_image}
                        {transaction.category.name}
                      </TableCell>
                      <TableCell>
                        {`${transaction.user_account.currency_type} ${currency(Number(transaction.transaction.amount))}`}
                      </TableCell>
                      <TableCell>
                        {transaction.transaction.transaction_date}
                      </TableCell>
                      <TableCell>
                        {transaction.transaction.description}
                      </TableCell>
                      <TableCell>
                        {transaction.transaction.transaction_type}
                      </TableCell>
                      <DropdownDeleteEdit
                        account_id={account_id}
                        transaction={transaction.transaction}
                        setLoading={setLoading}
                        user_id={user_id}
                      />
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}
