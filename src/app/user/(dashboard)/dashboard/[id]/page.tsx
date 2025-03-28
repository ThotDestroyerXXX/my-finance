"use client";
import BalanceCard from "@/components/balance-card";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "../data.json";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import Spinner from "@/components/ui/spinner";
import MonthlyBudget from "@/components/monthly-budget";
import TransactionChart from "@/components/TransactionChart";

export default function Page({
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

  const { data: session } = authClient.useSession();

  const {
    data: account,
    isPending,
    isFetched,
  } = api.account.getAccountByUserId.useQuery(
    {
      user_id: session?.user.id ?? "",
      account_id: param?.id ?? "",
    },
    {
      enabled: !!param?.id && !!session?.user.id,
    },
  );
  const { data: monthlyBudget } = api.budget.getMonthlyBudget.useQuery(
    {
      user_account_id: param?.id ?? "",
    },
    {
      enabled: !!param?.id,
    },
  );

  const { data: monthlyExpense } = api.transaction.getMonthlyExpense.useQuery(
    {
      account_id: param?.id ?? "",
    },
    {
      enabled: !!param?.id,
    },
  );

  const { data: overallIncome } = api.transaction.getOverallIncome.useQuery(
    {
      account_id: param?.id ?? "",
    },
    {
      enabled: !!param?.id,
    },
  );

  const { data: overallExpense } = api.transaction.getOverallExpense.useQuery(
    {
      account_id: param?.id ?? "",
    },
    {
      enabled: !!param?.id,
    },
  );

  if (
    (!param?.id || !session?.user.id || !account) &&
    !isPending &&
    isFetched
  ) {
    toast.error("Account not found");
    redirect("/user/account-list");
  } else {
    return (
      <>
        {loading && <Spinner />}
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex flex-row justify-between gap-4 px-4 max-lg:flex-col @lg:px-6">
                <div className="flex-1">
                  <BalanceCard
                    account={account}
                    isPending={isPending}
                    isFetched={isFetched}
                    setLoading={setLoading}
                  />
                </div>
                <div className="flex-1">
                  <MonthlyBudget
                    account={account}
                    isPending={isPending}
                    isFetched={isFetched}
                    setLoading={setLoading}
                    monthlyBudget={monthlyBudget}
                    monthlyExpense={monthlyExpense}
                  />
                </div>
              </div>
              {overallIncome &&
                overallExpense &&
                (overallIncome.length > 0 || overallExpense.length > 0) && (
                  <>
                    <div className="gap-4 px-4 lg:px-6">
                      <TransactionChart
                        income={overallIncome}
                        expense={overallExpense}
                      />
                    </div>
                    <SectionCards
                      income={overallIncome}
                      expense={overallExpense}
                      currencyType={account?.currency_type ?? ""}
                    />
                  </>
                )}

              <DataTable data={data} />
            </div>
          </div>
        </div>
      </>
    );
  }
}
