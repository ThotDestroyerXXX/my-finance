"use client";
import CategoryBudgetCard from "@/components/category-budget-card";
import CreateCategoryBudget from "@/components/create-category-budget";
import MonthlyBudget from "@/components/monthly-budget";
import Spinner from "@/components/ui/spinner";
import { fetchAccountByUserId } from "@/hooks/account-hook";
import {
  fetchCategoryBudgetByUserId,
  fetchMonthlyBudgetByAccountId,
} from "@/hooks/budget-hook";
import { fetchMonthlyExpenseByAccountId } from "@/hooks/transaction-hook";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function Budget({
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
  const { account, isPending, isFetched } = fetchAccountByUserId(
    session.data?.user.id ?? "",
    param?.id ?? "",
  );

  const { monthlyBudget } = fetchMonthlyBudgetByAccountId(param?.id ?? "");

  const { monthlyExpense } = fetchMonthlyExpenseByAccountId(param?.id ?? "");

  const { categoryBudget } = fetchCategoryBudgetByUserId(
    session.data?.user.id ?? "",
  );

  return (
    <>
      {loading && <Spinner />}
      <div className="flex h-[13rem] flex-col items-center justify-center p-4 text-center lg:p-6">
        <MonthlyBudget
          account={account}
          isFetched={isFetched}
          isPending={isPending}
          monthlyBudget={monthlyBudget}
          setLoading={setLoading}
          monthlyExpense={monthlyExpense}
        />
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center gap-5 px-4 lg:px-6">
        <CreateCategoryBudget
          setLoading={setLoading}
          user_id={session.data?.user.id}
          placeholder="Create"
        />
        {categoryBudget && (
          <>
            {categoryBudget.map((category) => (
              <CategoryBudgetCard
                categoryBudget={category}
                setLoading={setLoading}
                key={category.category_budget.id}
                currency_type={account?.currency_type ?? ""}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}
