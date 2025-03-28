"use client";
import AddTransaction from "@/components/add-transaction";
import TransactionTable from "@/components/transaction-table";
import Spinner from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function Expense({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const [param, setParam] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchParam = async () => {
      return await params;
    };
    fetchParam()
      .then((param) => {
        setParam(param);
      })
      .catch(() => {
        setParam(null);
      });
  }, [params]);

  const session = authClient.useSession();
  const {
    data: expenses,
    isPending,
    isFetched,
  } = api.transaction.getAccountExpenseByUserId.useQuery(
    {
      user_id: session.data?.user.id ?? "",
      account_id: param?.id ?? "",
    },
    {
      enabled: !!param?.id && !!session.data?.user.id,
    },
  );
  if (
    (!param?.id || !session.data?.user.id || !expenses) &&
    !isPending &&
    isFetched
  ) {
    redirect("/auth/login");
  } else {
    return (
      <>
        {loading && <Spinner />}
        {(!expenses || expenses.length <= 0) &&
        isFetched &&
        param?.id &&
        session.data?.user.id ? (
          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
            <h2 className="text-xl">You don&apos;t have expense Yet</h2>
            <AddTransaction
              user_id={session.data.user.id}
              account_id={param.id}
              setLoading={setLoading}
            />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col gap-6 p-6">
            <TransactionTable
              transactions={expenses}
              isFetched={isFetched}
              isPending={isPending}
              user_id={session.data?.user.id}
              account_id={param?.id}
              setLoading={setLoading}
            />
          </div>
        )}
      </>
    );
  }
}
