"use client";
import BalanceCard from "@/components/balance-card";
import { SectionCards } from "@/components/section-cards";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { useContext, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/ui/spinner";
import MonthlyBudget from "@/components/monthly-budget";
import TransactionChart from "@/components/TransactionChart";
import { fetchAccountByUserId } from "@/hooks/account-hook";
import {
  fetchMonthlyExpenseByAccountId,
  fetchOverallExpenseByAccountId,
  fetchOverallIncomeByAccountId,
  fetchTransactionByAccountId,
} from "@/hooks/transaction-hook";
import { fetchMonthlyBudgetByAccountId } from "@/hooks/budget-hook";
import TransactionTable from "@/components/transaction-table";
import AddTransaction from "@/components/add-transaction";
import { ParamContext } from "../useContext/context";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const param = useContext(ParamContext);

  const { data: session } = authClient.useSession();

  const { account, isPending, isFetched } = fetchAccountByUserId(
    session?.user.id ?? "",
    param?.id ?? "",
  );
  const { monthlyBudget } = fetchMonthlyBudgetByAccountId(param?.id ?? "");

  const { monthlyExpense } = fetchMonthlyExpenseByAccountId(param?.id ?? "");

  const { overallIncome } = fetchOverallIncomeByAccountId(param?.id ?? "");

  const { overallExpense } = fetchOverallExpenseByAccountId(param?.id ?? "");

  const { transactions } = fetchTransactionByAccountId({
    user_id: session?.user.id ?? "",
    account_id: param?.id ?? "",
  });

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
              {(!transactions || transactions.length <= 0) &&
              isFetched &&
              param?.id &&
              session?.user.id ? (
                <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <h2 className="text-xl">You don&apos;t have expense Yet</h2>
                  <AddTransaction
                    user_id={session.user.id}
                    account_id={param.id}
                    setLoading={setLoading}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-4 px-4 lg:px-6">
                  <TransactionTable
                    account_id={param?.id}
                    isFetched={isFetched}
                    isPending={isPending}
                    setLoading={setLoading}
                    user_id={session?.user.id}
                    transactions={transactions}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}
