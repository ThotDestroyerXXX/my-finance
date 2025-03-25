import { api } from "@/trpc/react";
import { Card, CardHeader, CardDescription, CardTitle } from "./ui/card";

export default function IncomeCard({
  account_id,
  user_id,
  currency,
}: Readonly<{
  account_id: string | undefined;
  user_id: string | undefined;
  currency: string | undefined;
}>) {
  const { data: totalIncome } = api.account.getTotalIncome.useQuery({
    account_id: account_id ?? "",
    user_id: user_id ?? "",
  });
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Income Overall</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {currency}
          {totalIncome?.[0]?.totalIncome ?? "0"}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
