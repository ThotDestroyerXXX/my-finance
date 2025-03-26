import { api } from "@/trpc/react";
import { authClient } from "@/lib/auth-client";
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
import { redirect } from "next/navigation";

export default function IncomeTable({
  account_id,
}: Readonly<{ account_id: string | undefined }>) {
  const session = authClient.useSession();
  const {
    data: incomes,
    isPending,
    isFetched,
  } = api.account.getAccountIncomeByUserId.useQuery(
    {
      user_id: session.data?.user.id ?? "",
      account_id: account_id ?? "",
    },
    {
      enabled: !!account_id && !!session.data?.user.id,
    },
  );
  if (
    (!account_id || !session.data?.user.id || !incomes) &&
    !isPending &&
    isFetched
  ) {
    redirect("/auth/login");
  } else {
    return (
      <>
        {isPending && !isFetched ? (
          <Skeleton className="h-[20rem] w-full" />
        ) : (
          <>
            {(!incomes || incomes.length <= 0) && isFetched ? (
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <h2 className="text-xl">You don&apos;t have income Yet</h2>
                <AddTransaction
                  user_id={session.data?.user.id}
                  account_id={account_id}
                />
              </div>
            ) : (
              <>
                <div>
                  <AddTransaction
                    user_id={session.data?.user.id}
                    account_id={account_id}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Transaction Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomes?.map((income) => (
                      <TableRow key={income.transaction.id}>
                        <TableCell className="font-medium">
                          {income.user_account.name}
                        </TableCell>
                        <TableCell>
                          {income.category.icon_image}
                          {income.category.name}
                        </TableCell>
                        <TableCell>{income.transaction.amount}</TableCell>
                        <TableCell>
                          {income.transaction.transaction_date}
                        </TableCell>
                        <TableCell>{income.transaction.description}</TableCell>
                        <TableCell>
                          {income.transaction.transaction_type}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </>
        )}
      </>
    );
  }
}
