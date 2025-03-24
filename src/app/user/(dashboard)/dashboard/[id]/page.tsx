"use client";
import { redirect } from "next/navigation";
import { api } from "@/trpc/react";
import { authClient } from "@/lib/auth-client";
import Dashboard from "./dashboard";
import { useEffect, useState } from "react";

export default function Page({
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
    data: account,
    isPending,
    isFetched,
  } = api.account.getAccountByUserId.useQuery(
    {
      user_id: session.data?.user.id ?? "",
      account_id: param?.id ?? "",
    },
    {
      enabled: !!param && !!session.data?.user.id,
    },
  );

  if ((!param || !account || !session) && !isPending && isFetched) {
    redirect("/user/account-list");
  } else {
    return <Dashboard account={account} />;
  }
}
