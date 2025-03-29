import { currency } from "@/lib/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function MonthlyTransaction({
  currencyType,
  transactionAmount,
  placeholder,
}: Readonly<{
  currencyType: string | undefined;
  transactionAmount: 0 | string | undefined;
  placeholder: string;
}>) {
  return (
    <Card className="flex h-full min-w-[20rem] flex-col justify-center gap-5 py-4 text-justify">
      <CardHeader>
        <CardTitle className="text-muted-foreground text-lg">
          Your {placeholder} This Month
        </CardTitle>
        <CardDescription className="text-foreground text-xl font-semibold break-all tabular-nums">
          {currencyType}
          {currency(Number(transactionAmount))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
