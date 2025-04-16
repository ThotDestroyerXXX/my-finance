"use client";
import AddTransaction from "@/components/add-transaction";
import MonthlyChart from "@/components/MonthlyChart";
import TransactionTable from "@/components/transaction-table";
import Spinner from "@/components/ui/spinner";
import {
  fetchAccountIncomeByUserId,
  fetchMonthlyIncomeByAccountId,
} from "@/hooks/transaction-hook";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useContext, useState } from "react";
import { ParamContext } from "../../useContext/context";

export default function Income() {
  const [loading, setLoading] = useState<boolean>(false);

  const param = useContext(ParamContext);

  const session = authClient.useSession();
  const { incomes, isPending, isFetched } = fetchAccountIncomeByUserId(
    session.data?.user.id ?? "",
    param?.id ?? "",
  );

  const { monthlyIncome } = fetchMonthlyIncomeByAccountId(param?.id ?? "");

  if (
    (!param?.id || !session.data?.user.id || !incomes) &&
    !isPending &&
    isFetched
  ) {
    redirect("/auth/login");
  } else {
    return (
      <>
        {loading && <Spinner />}
        {(!incomes || incomes.length <= 0) &&
        isFetched &&
        param?.id &&
        session.data?.user.id ? (
          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
            <h2 className="text-xl">You don&apos;t have income Yet</h2>
            <AddTransaction
              user_id={session.data.user.id}
              account_id={param.id}
              setLoading={setLoading}
            />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col gap-6 p-6">
            <MonthlyChart
              isFetched={isFetched}
              isPending={isPending}
              placeholder="Income"
              transactionAmount={monthlyIncome}
              transactions={incomes}
            />
            <TransactionTable
              transactions={incomes}
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
