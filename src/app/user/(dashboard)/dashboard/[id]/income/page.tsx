"use client";
import IncomeCard from "@/components/income-card";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function Income({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const [param, setParam] = useState<{ id: string } | null>(null);
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
    data: incomes,
    isPending,
    isFetched,
  } = api.account.getAccountIncomeByUserId.useQuery(
    {
      user_id: session.data?.user.id ?? "",
      account_id: param?.id ?? "",
    },
    {
      enabled: !!param && !!session.data?.user.id,
    },
  );

  if ((!param || !incomes || !session) && !isPending && isFetched) {
    redirect("/user/account-list");
  } else {
    return (
      <div>
        <IncomeCard
          account_id={param?.id}
          user_id={session.data?.user.id}
          currency={incomes?.[0]?.user_account.currency_type ?? "tes"}
        />
      </div>
    );
  }
}
